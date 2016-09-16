import * as mongodb from 'mongodb';

export class DAL<T>{
    mongoClient = mongodb.MongoClient;  
    _url = 'mongodb://localhost:27017/mybudget';
    _db:mongodb.Db;
    _collection:mongodb.Collection;

    constructor(url:string, coll:string){
        this._url = url;
        var obj = this;
        this.mongoClient.connect(url, function (err:any, db:any) {
                console.log("Connecting to server...",err);
                obj._db = db;
                obj._collection = db.collection(coll);  
        });
    }

    getRecords(filter:string,callback:any){
        this._collection.find().toArray( callback );
    }
}

