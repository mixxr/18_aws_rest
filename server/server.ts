import * as express from 'express';
const app = express();
import * as bodyParser from 'body-parser';
import {SingleRequest} from "./model/single-request";
import {MsCartItem} from "../app/ms-cart-item";
import {DAL} from "./dal";

// configure our app to use bodyParser(it let us get the json data from a POST)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req:any, res:any, next:any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port:number = process.env.PORT || 8080;
const router = express.Router();

var readJSON = function ():any{
  var jsonfile = require('jsonfile');
  return jsonfile.readFileSync("server/normalizers/files/cart-items-all.json");
}

// test route
router.get('/', function (req:any, res:any) {
  console.log("GET-request-param: ",req.query.budget);

  if (!req.query.budget === undefined) res.status(400).send("budget is needed");

  var budget:SingleRequest = JSON.parse(req.query.budget);
  let priceRange: number[] = [(budget.maxItems === 1)?budget.maxValue * 0.75:0, budget.maxValue]; 

  dal.getRecords(budget.cOK, budget.cKO, budget.pBad, priceRange, budget.maxItems, function(err:any, items:any[]) {
      let currValue:number = 0;
      let cartItems:MsCartItem[] = [];
      for(let i=0;i<items.length;i++)
        if ((currValue+items[i].price) <= budget.maxValue){
          cartItems.push(items[i]);
          currValue += items[i].price;
        }
      
      res.send(cartItems);
  });
});

var itemsMainProps:any = [];
var loadItemMainProps = function(){
  console.log("Loading skues...");
  dal.getHeads([], ["sku","category","price","description"], true, 0, function(err:any, items:any[]) {      
      items.forEach((item)=>itemsMainProps[item.sku]={"category":item.category, "price":item.price, "description":item.description});
      console.log(items.length, " skues loaded.");
      createCompatibilityMatrix();
  });
}

var findSimilarity = function(prop:any, item1:any, item2:any):boolean {
  // TODO: description comparison (via mongodb index???)
  try{
    let n1 = parseFloat(item1[prop]);
    let n2 = parseFloat(item1[prop]);
    if (!(isNaN(n1) || isNaN(n2)))
      return (n1 >= (n2 *.95) && n1 <= (n2 * 1.05)); 
  }catch(e){}

  return (item1[prop] == item2[prop]);
   
}

var itemCM:any = {};
var createCompatibilityMatrix = function() {
  let stime = Date.now();
  var aSku = Object.keys(itemsMainProps)[0]; // sku={"category":item.category, "price":item.price, "description":item.description});
  console.log("creating CompatibilityMatrix...", Date.now(),itemsMainProps.length ,aSku);
  //var nItems = itemsMainProps.length;
  let j = 1;
  Object.keys(itemsMainProps[aSku]).forEach((prop)=>{
    console.log('-------------- prop:',prop, Date.now());
    Object.keys(itemsMainProps).forEach((item1sku)=>{
      let i = 1; 
      Object.keys(itemsMainProps).some((item2sku)=>{
        if (i>=j) return true;  
        
        let res = findSimilarity(prop,itemsMainProps[item1sku],itemsMainProps[item2sku]);
        if (res){
          if (!itemCM[item1sku]) itemCM[item1sku] = {};
          if (!itemCM[item1sku][prop]) itemCM[item1sku][prop] = [];
          //itemCM[item1sku].push(item2sku);
          itemCM[item1sku][prop].push(item2sku);
        }
        i++;
      });
      j++; 
    });
  });
  console.log('--finish:',Date.now(),(Date.now()-stime)/1000);
  Object.keys(itemCM).forEach((item1sku)=>{
    //console.log('> ',item1sku,JSON.stringify(itemCM[item1sku]));
  });
}

// prefixed all routes with /api
app.use('/cart-items', router);

var activeServer = function() {
  app.listen(port);
  loadItemMainProps();
  console.log('http://127.0.0.1:' + port + '/cart-items');
}

var dal:DAL<MsCartItem> = new DAL("mongodb://localhost:27017/mybudget", "items", activeServer);
