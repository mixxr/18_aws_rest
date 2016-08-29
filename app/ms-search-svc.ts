import {Injectable} from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// Statics
import 'rxjs/add/observable/throw';

import {MsBudget} from "./ms-budget";
import {MsCartItem} from "./ms-cart-item";

@Injectable()
export class MsSearchSvc{
    constructor (private http: Http) {}
    private svcUrl = 'https://extraction.import.io/query/extractor/335a589d-78da-4a0b-af86-d7af2bbcc055?_apikey=fc712e2c3ec64a9ab61a77549fe9b5c40fa12d1066891a94bcd66097922881bc38e02c311a9fdead8b068bb1917199723de8af16880630351a6f944d9d065142b49dbb638494b1aa829e8fc82971d64f&url=http%3A%2F%2Fwww.immobiliare.it%2Faste%2FRoma%2Faste-appartamenti-Roma.html%3Fcriterio%3Dprezzo%26ordine%3Dasc%26superficieMinima%3D60%26fasciaPiano%5B%5D%3D20%26fasciaPiano%5B%5D%3D30%26idMZona%5B%5D%3D10151%26idMZona%5B%5D%3D10152%26idMZona%5B%5D%3D10153%26idMZona%5B%5D%3D10154%26idMZona%5B%5D%3D10155%26idMZona%5B%5D%3D10156%26idMZona%5B%5D%3D10165%26idMZona%5B%5D%3D10167%26idMZona%5B%5D%3D10168%26idMZona%5B%5D%3D10169%26idMZona%5B%5D%3D10170%26idMZona%5B%5D%3D10283'; 

    getList (aBudget: MsBudget): Observable<MsCartItem[]> {
        var headers = new Headers();
        //headers.append('x-api-key', 'ezjIkkJORt1W3kkfxbGd14hLaUdkSpmY8L3LQIvp');
        //let headers = new Headers({ 'Content-Type': 'application/json' });
        //let options = new RequestOptions({ headers: headers });
        
        // TODO: usare aBudget
        return this.http.get(this.svcUrl, { headers})
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
        const anItem = new MsCartItem(0,'',0.0);
        var cols : string[] = [];
        for (var x in anItem) cols.push(x);
        return cols;
    }

    
}