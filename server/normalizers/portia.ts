/*
* 

https://data.import.io/extractor/cef498e8-51d9-44a0-9fb8-721d95273f42/json/latest?_apikey=fc712e2c3ec64a9ab61a77549fe9b5c40fa12d1066891a94bcd66097922881bc38e02c311a9fdead8b068bb1917199723de8af16880630351a6f944d9d065142b49dbb638494b1aa829e8fc82971d64f


*/
import {MsCartItem} from '../../app/ms-cart-item';
import {RefreshReport} from '../model/refresh-report';
import {INormalizer} from './i-normalizer';
import {Collection} from 'mongodb';

export class Portia implements INormalizer{

  start(jsonFilename: string, collection: Collection, callback: any ) {
      let fn = jsonFilename.substr(jsonFilename.lastIndexOf('\\')+1);
      let source = fn.split('-')[0]; // shopname

      let defaults = require("./"+source+"-defaults.json");
      let defaultCat = defaults.category;
      let defaultShipCost:number = defaults.shipCost;

      console.log("processing:",fn,', shopname:', source,', defaults:', defaults);

      let report:RefreshReport = new RefreshReport((new Date()).getTime(),[],source,"portia");

      var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader(jsonFilename);

      lr.on('error', function (err:any) {
        // 'err' contains error object
        console.log("error:", err);
        callback(report);
      });

      lr.on('line', function (line:string) {
        // 'line' contains the current line without the trailing newline character.
        let item = JSON.parse(line);
          report.total++;
          if (item.price === undefined) {
            report.errors++;
            report.errList[item.name] = 'no price';
            process.stdout.write("x");
            return;
          }
          process.stdout.write(".");
          let cItem:MsCartItem = new MsCartItem(undefined,item.name[0],getFloat(item.price,undefined));
          cItem.crawler = report.crawler;
          cItem.shopname = source;
          cItem.category = item.category[0] || defaultCat;
          if (cItem.category && report.categories.indexOf(cItem.category) === -1) report.categories.push(cItem.category);
          cItem.currency = 'EUR';
          cItem.description = buildDesc(item);
          let oprice:number = getFloat(item.oldPrice,undefined);
          cItem.discount = (oprice)?+((oprice - cItem.price)/oprice).toFixed(2):undefined;
          cItem.imgUrl = item.imgUrl[0];
          cItem.link = (item.buyLink)? item.buyLink[0] : item.url;
          cItem.BOPIS = (item.bopisLink)? item.bopisLink[0] : null;
          cItem.outOfStock = false;
          cItem.qty = 1;
          cItem.sku = item.sku || getSku(cItem.link);
          cItem.secondhand = false;
          cItem.shippedPrice = getFloat(item.shippedPrice,' ');
          cItem.shipCost = (cItem.shippedPrice>0)?cItem.shippedPrice-cItem.price:defaultShipCost;
          cItem.refresh = report.mills;
          if((report.skus[cItem.sku]===undefined)){
            report.skus[cItem.sku] = 1;
            collection.findOneAndReplace({"sku":cItem.sku,"shopname":cItem.shopname},cItem, { upsert : true }, function(err:any,result:any){
              if (!err){
                report.updates += (result.lastErrorObject.updatedExisting)?1:0;
                report.inserts += (result.lastErrorObject.updatedExisting)?0:1;
              }else
                report.errors++;        
            });
          }else{
            report.duplicates++;
            report.skus[cItem.sku]++;
          }
          
      });

      lr.on('end', function () {
        // All lines are read, file is closed now.
        console.log('stream ended. removing old...');
        report.categories.push("null");
        collection.remove({"shopname":report.shopname, "category": { $in: report.categories }, "refresh":{"$lt":report.mills}},function(err:any,res:any){
          if (!err) report.deletes = res.result.n;
          else report.errors++;
        });
        callback(report); 
      });
  }
}


/*
var MongoClient = require('mongodb').MongoClient;  
var collection:any = undefined;
var url = 'mongodb://localhost:27017/mybudget';
var _db:any;
*/


/*console.log("Connecting to server...");
MongoClient.connect(url, function (err:any, db:any) {
  if (err){
    console.log("db is down:", url);
    return;
  }
  console.log("OK");
  _db = db;
  collection = db.collection("items");  
  start();
});
*/
//var counter = 0, n=0;
//var cart:MsCartItem[] = [];



var getFloat = function(s:any,sep:string): number{
  if (s && s[0])
  {
    let str = s[0];
    try{
      if(sep)
        str = str.split(sep)[0];
      return parseFloat(str.replace(/[€$A-Z ]+/,"").replace(".","").replace(",","."));
    }catch(e){}
  }
  return 0.00;
}

// var getText = function(s:any){
//   if (s && s[0])
//   {
//     if(s[0].text)
//       return s[0].text;
//     if(s[0].src)
//         return s[0].src;
//     if(s[0].href)
//         return s[0].href;
//   }
//   return undefined;
// }

// accepts url
var getSku = function(sURL:any): string{
  var ret:string = undefined;
  try{
    let params:string[] = sURL.split('?')[1].split('&');
    let el = params.find((e)=>(e.startsWith('sku') || e.startsWith('prod') || e.startsWith('pid') || e.startsWith('cod')));
    ret = el.split('=')[1];
  }catch(e){}

  return ret;
}

// returns a csv string of desc
var buildDesc = function(fullJson:any): string{
  let retVal = fullJson.desc;
  if (fullJson.variants)
    fullJson.variants.forEach((v:any)=> {if (v.desc) retVal += (','+v.desc[0])});
  return retVal;
}



