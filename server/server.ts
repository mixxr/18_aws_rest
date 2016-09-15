import * as express from 'express';
const app = express();
import * as bodyParser from 'body-parser';
import {MsBudget} from "../app/ms-budget";
import {MsCartItem} from "../app/ms-cart-item";

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
  console.log("GET: ",req.query);
  console.log("GET-budget: ",req.query.budget);
  console.log("-- currency: ",req.query.budget.currency);
  var budget:MsBudget = JSON.parse(req.query.budget);
  console.log("-- currency: ",budget.currency);
  console.log("-- similar: ",budget.similar);
  
  let items = readJSON();
  console.log(items);
  
    
  res.json(items);
});

// prefixed all routes with /api
app.use('/cart-items', router);

app.listen(port);
console.log('http://127.0.0.1:' + port + '/cart-items');