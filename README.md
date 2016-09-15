# Angular 2 NodeJS

npm install -g express-generator
npm install -g typescript
express SampleApp
npm install -g typings
typings install dt~node --global
typings install dt~express dt~serve-static dt~express-serve-static-core --global

# nodejs-express =-typescript from scratch

$ npm init -y
$ npm install -g typescript typings
$ npm install --save express
$ typings install --save --global --source dt node express
* optional (maybe the command above installs the following automatically)
$ typings install -SG dt~serve-static dt~express-serve-static-core
$ tsc --init
$ tsc
* remember tsc with filename does not load tsconfig.json!!

# node forever and watching mode
* $ [sudo] npm install forever -g
* $ cd /path/to/your/project
* $ [sudo] npm install forever-monitor -D
* $ forever start -w app.js

# CORS on ExpressJS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
