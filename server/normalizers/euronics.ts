/*
* 

https://data.import.io/extractor/cef498e8-51d9-44a0-9fb8-721d95273f42/json/latest?_apikey=fc712e2c3ec64a9ab61a77549fe9b5c40fa12d1066891a94bcd66097922881bc38e02c311a9fdead8b068bb1917199723de8af16880630351a6f944d9d065142b49dbb638494b1aa829e8fc82971d64f


*/
import * as fs from 'fs';
import {MsCartItem} from '../../app/ms-cart-item';

var JSONStream = require('JSONStream'),
  es = require('event-stream');

var counter = 0, n=0;
var cart:MsCartItem[] = [];

var getStream = function () {
    var jsonData = 'server/normalizers/files/euronicsCamera.json',
        stream = fs.createReadStream(jsonData, {flags: 'r', encoding: 'utf8'}),
        parser = JSONStream.parse('*.*.*.*.group');
        
        return stream.pipe(parser);

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

var saveJSON = function (obj:any){
  var jsonfile = require('jsonfile');
  jsonfile.writeFileSync("server/normalizers/files/cart-items.json", obj)
}

 getStream()
  .pipe(es.mapSync(function (data: Array<any>) {
    console.log(counter++, data.length);
    data.forEach((item)=>{
      let cItem:MsCartItem = new MsCartItem(undefined,item.url[0].text,parseFloat(item.price[0].text));
      cItem.special = (item.specialLink!== undefined);
      cItem.currency = "EUR";
      cItem.description = getText(item.desc).replace(/\r?\n|\r/g,"");
      cItem.origin = "Euronics";
      cItem.imgUrl = item.Image[0].src;
      cItem.link = item.url[0].href;
      let p:number = getFloat(item.shippedPrice,' ');
      cItem.shipCost = (p>0)?p-cItem.price:0;
      cItem.BOPIS = (item.BOPISLink !== undefined);
      cItem.discount = getFloat(item.discount,'%');
      cItem.category = getText(item.type);
      console.log(n++,">",cItem);
      cart.push(cItem);
    });
    saveJSON(cart); // TODO: after pipe()
  }));