import * as express from 'express';
const app = express();
import * as bodyParser from 'body-parser';
import {SingleRequest} from "./model/single-request";
import {MsCartItem} from "../app/ms-cart-item";
import {DAL} from "./dal";

// configure our app to use bodyParser(it let us get the json data from a POST)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
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
router.get('/', function (req, res) {
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
