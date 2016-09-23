import {Injectable} from "@angular/core";
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import {SingleRequest} from '../server/model/single-request';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// Statics
import 'rxjs/add/observable/throw';

import {MsBudget, Similarity} from "./ms-budget";
import {MsCartItem} from "./ms-cart-item";



@Injectable()
export class MsSearchSvc{
    constructor (private http: Http) {}
    private svcUrl = 'http://192.168.1.102:8080/cart-items'; 

    createSingleRequest(b:MsBudget):SingleRequest{
        let request:SingleRequest = new SingleRequest();

        request.maxValue = b.value - b.currentValue;
        request.maxItems = b.maxItems;
        Object.keys(b.similar).forEach((c)=>{
            if (b.similar[c] === Similarity.Love) request.sOK.push(c);
            else
                if (b.similar[c] === Similarity.Hate) request.sKO.push(c);
        });
        request.cOK = b.categories;
        // add all sku in spite of the qty
        Object.keys(b.cart).forEach((sku)=>request.pBad.push(sku));

        return request;
    }

    // TODO: usare Observable per evitare il passaggio a ritroso della list corrente: la lista vera la mantiene il servizio
    getList (aBudget: MsBudget): Observable<MsCartItem[]> {
        console.log('getList: ',aBudget);
        let search: URLSearchParams = new URLSearchParams();
        
        search.set('budget', JSON.stringify(this.createSingleRequest(aBudget)));
        //headers.append('x-api-key', 'ezjIkkJORt1W3kkfxbGd14hLaUdkSpmY8L3LQIvp');
        //let headers = new Headers({ 'Access-Control-Request-Origin:': '*' });
        //let options = new RequestOptions({ headers: headers });
        let headers = new Headers();

        return this.http.get(this.svcUrl, { headers, search})
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        console.log("extractData:",body);

        return body || [];
    }
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error('handleError:',error); // log to console instead
        return Observable.throw(errMsg);
    }

    get colNames():string[]{
        const anItem = new MsCartItem(undefined,'',0.0);
        var cols : string[] = [];
        for (var x in anItem) cols.push(x);
        return cols;
    }


    
    
}