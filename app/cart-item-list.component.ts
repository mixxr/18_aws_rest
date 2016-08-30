import {Component} from "@angular/core";

import {MsCartItem} from "./ms-cart-item";
import {MsBudget} from "./ms-budget";
import {MsSearchSvc} from "./ms-search-svc";


@Component({
    selector: 'cart-item-list',
    templateUrl: 'app/cart-item-list.component.html'
})

export class CartItemList {
    
    public static _DEF_BUDGET: number = 500;

    model:MsBudget;
    message = "Your bargain";
    list:MsCartItem[];

    currencies = ["EUR", "USD"];
    submitted = false;

    constructor(public searchSvc:MsSearchSvc){
        console.log('constructor>list:',this.list);
    }

    ngOnInit() {
        this.model = new MsBudget(CartItemList._DEF_BUDGET);
    }

    // TODO: Workaround until NgForm has a reset method (#6822)
    active = true;

    // search bar event handler
    onSubmit() { 
        console.log('onSubmit:',this.submitted);
        this.searchSvc.getList(this.model)
                .subscribe(
                    list => this.list = list,
                    error => this.message = <any>error);
        this.submitted = true; 
    }
    onEdit() { this.submitted = false; }
    onReset() {
        this.model = new MsBudget(CartItemList._DEF_BUDGET);
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

    get diagnostic() { return JSON.stringify(this.model); }

    // list event handler
    onSelect(itemId:number){
        console.log('select:', itemId);
    }
 
    // save(S)|remove(R)
    onConsider(itemId:number,action:string){
        console.log('consider:', itemId,' ',action);
        if (this.model.consider === undefined || this.model.consider.length === 0)
            this.model.consider = ';';
        if (this.model.consider.indexOf(';'+itemId+':') >= 0)
            this.model.consider = this.model.consider.replace(';'+itemId+':'+(action==='S'?'R':'S')+';',';'+itemId+':'+action+';');
        else
            this.model.consider += itemId+':'+action+';';
        
    }

    // avoid(A)|find(F)
    onSimilar(itemId:number,action:string){
        console.log('similar:', itemId,' ',action);
        if (this.model.similar === undefined || this.model.similar.length === 0)
            this.model.similar = ';';
         if (this.model.similar.indexOf(';'+itemId+':') >= 0)
            this.model.similar = this.model.similar.replace(';'+itemId+':'+(action==='A'?'F':'A')+';',';'+itemId+':'+action+';');
        else
            this.model.similar += itemId+':'+action+';';
    }


}