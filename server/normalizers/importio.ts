/*
* 

https://data.import.io/extractor/cef498e8-51d9-44a0-9fb8-721d95273f42/json/latest?_apikey=fc712e2c3ec64a9ab61a77549fe9b5c40fa12d1066891a94bcd66097922881bc38e02c311a9fdead8b068bb1917199723de8af16880630351a6f944d9d065142b49dbb638494b1aa829e8fc82971d64f


*/
import * as fs from 'fs';
import {MsCartItem} from '../../app/ms-cart-item';

class Refresher {
  constructor(
    public mills : number,
    public categories : string[],
    public origin: string,
    public inserts:number = 0,
    public updates:number = 0,
    public deletes:number = 0,
    public errors:number = 0
  ){}
};

var JSONStream = require('JSONStream'),
  es = require('event-stream');

var MongoClient = require('mongodb').MongoClient;  
var collection:any = undefined;
var url = 'mongodb://localhost:27017/mybudget';
var _db:any;
MongoClient.connect(url, function (err:any, db:any) {
  console.log("Connecting to server...");
  _db = db;
  collection = db.collection("items");  
});

//var counter = 0, n=0;
//var cart:MsCartItem[] = [];
var refresher:Refresher = new Refresher((new Date()).getTime(),[],"Euronics");

var getStream = function () {
    var jsonData = 'server/normalizers/files/euronics-camera-source.json',
        stream = fs.createReadStream(jsonData, {flags: 'r', encoding: 'utf8'}),
        parser = JSONStream.parse('*.*.*.*.group');

         stream.on('end', function() {
            console.log('stream ended. removing old...');
            collection.remove({"origin":refresher.origin, "category": { $in: refresher.categories }, "refresh":{"$lt":refresher.mills}},function(err:any,res:any){
              if (!err) refresher.deletes = res.result.n;
              else refresher.errors++;
              console.log('refresher:>',refresher);              
            });
            _db.close();
          });

          stream.on('exit', function (code:any) {
            console.log('exit ',code);
          });
        
        return stream.pipe(parser,{end:true});

};

var getFloat = function(s:any,sep:string){
  if (!s)
    return 0.00;
  let str = s[0].text;
  if(sep)
    str = str.split(sep)[0];
  try{
    return parseFloat(s);
  }catch(e){}
  return 0.00;
}

var getText = function(s:any){
  if (s && s[0])
  {
    return s[0].text;
  }
  return "";
}

var getSku = function(s:any){
  var ret:string;
  if (s && s[0])
  {
    let params:string[] = s[0].href.split('?')[1].split('&');
    let el = params.find((e)=>(e.startsWith('sku') || e.startsWith('pro') || e.startsWith('pid')));
    ret = el.substring(el.indexOf('=')+1);
  }
  return ret;
}

var saveJSON = function (obj:any){
  var jsonfile = require('jsonfile');
  jsonfile.writeFileSync("server/normalizers/files/cart-items-tv.json", obj)
}

 getStream()
  .pipe(es.mapSync(function (data: Array<any>) {
    data.forEach((item)=>{
      let cItem:MsCartItem = new MsCartItem(undefined,item.url[0].text,parseFloat(item.price[0].text));
      cItem.special = (item.specialLink!== undefined);
      cItem.currency = "EUR";
      cItem.sku = getSku(item.buyLink);
      cItem.description = getText(item.desc).replace(/\r?\n|\r/g,"");
      cItem.origin = "Euronics";
      cItem.imgUrl = item.Image[0].src;
      cItem.link = item.url[0].href;
      let p:number = getFloat(item.shippedPrice,' ');
      cItem.shipCost = (p>0)?p-cItem.price:0;
      cItem.BOPIS = (item.BOPISLink !== undefined);
      cItem.discount = getFloat(item.discount,'%');
      cItem.category = getText(item.type);
      if (cItem.category && refresher.categories.indexOf(cItem.category) === -1) refresher.categories.push(cItem.category);
      cItem.refresh = refresher.mills;

      collection.findOneAndReplace({"sku":cItem.sku,"origin":cItem.origin},cItem, { upsert : true }, function(err:any,result:any){
        if (!err){
          refresher.updates += (result.lastErrorObject.updatedExisting)?1:0;
          refresher.inserts += (result.lastErrorObject.updatedExisting)?0:1;
        }else
          refresher.errors++;        
      });

    }); // forEach
  }));

  // TODO : delete < mills