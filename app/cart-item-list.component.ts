import {Component} from "@angular/core";
import {NgClass} from '@angular/common';

import {MsCartItem} from "./ms-cart-item";
import {MsBudget} from "./ms-budget";
import {MsSearchSvc} from "./ms-search-svc";


@Component({
    selector: 'cart-item-list',
    templateUrl: 'app/cart-item-list.component.html',
    directives: [NgClass]
})

export class CartItemList {

    public static _DEF_BUDGET: number = 500;

    model:MsBudget;
    message = "Your bargain";
    list:MsCartItem[];
    //deletingLs: { [id: string] : boolean; } = {};

    currencies = ["EUR", "USD"];
    submitted = false;
    listView = false;

    constructor(public searchSvc:MsSearchSvc){
        console.log('constructor>list:',this.list);
    }

    ngOnInit() {
        this.model = new MsBudget(CartItemList._DEF_BUDGET);
        this.list = [];
        this.model.cart = {};
    }

    initList(list:MsCartItem[]){
        this.list = list;
        this.list.map((item)=>this.model.cart[item.sku]=item.qty);
    }


    getRows(): number{
        return this.list.length | 0;
    }

    getValue(): number{
        var prices = this.list.map(function(a:MsCartItem) {return (a.price*a.qty);});
        return prices.reduce((acc, value) => acc + value, 0);
    }

    getItem(itemId: string): MsCartItem{
        return this.list.find((item)=>(item.sku == itemId));
    }

    removeItem(itemId: string){
        console.log('removeItem:',itemId);
        var item = this.getItem(itemId);
        if (item){
            const i = this.list.indexOf(item);
            this.list = [...this.list.slice(0,i),
            ...this.list.slice(i+1)];
        }
    }
    

    // TODO: Workaround until NgForm has a reset method (#6822)
    active = true;

    // search bar event handler
    onSubmit() { 
        console.log('onSubmit:',this.submitted);
        this.searchSvc.getList(this.model)
                .subscribe(
                    list => this.initList(list),
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

    getDiagnostic(item: MsCartItem):string{
        return JSON.stringify(item);
    }

    // list event handler
    onSelect(itemId:string){
        console.log('select:', itemId);
    }
 
    onDelete(itemId:string){
        // this.getItem(itemId).oldQty = this.getItem(itemId).qty;
        // this.getItem(itemId).qty = 0;
        // this.onQtyChange(itemId,"0");
        if (this.model.forceDel)
            this.onDelConfirmBtn(itemId, true);
        else
            this.getItem(itemId).deleting = true;
    }

    onPin(itemId:number){
        // this.getItem(itemId).oldQty = this.getItem(itemId).qty;
        // this.getItem(itemId).qty = 0;
        // this.onQtyChange(itemId,"0");
        this.model.pin[itemId] = !this.model.pin[itemId]; 
    }

    onDelConfirmBtn(itemId:string, confirm:boolean){
        this.getItem(itemId).deleting = confirm;
        if (confirm) {
            this.model.cart[itemId] = 0;
            this.removeItem(itemId);
        }else
            this.getItem(itemId).qty = this.model.cart[itemId];
    }

    onQtyBtn(itemId:string, increment:number){
        console.log('btn:id,increment:',itemId,increment);
        this.getItem(itemId).qty += increment;
        console.log('btn:id,qty:',itemId,this.getItem(itemId).qty);
        this.onQtyChange(itemId,this.getItem(itemId).qty);
    }

    onQtyChange(itemId:string, newQty:number){
        console.log('chg:id,qty:',itemId,newQty);
        this.getItem(itemId).qty = newQty;
        if (newQty <= 0)
            this.getItem(itemId).deleting = true;
        else
            this.model.cart[itemId] = newQty;
    }



    // avoid(A)|find(F)
    onSimilar(itemId:number,iloveit:boolean){
        console.log('similar:', itemId,' ',iloveit);
        // if (this.model.similar === undefined || this.model.similar.length === 0)
        //     this.model.similar = ';';
        //  if (this.model.similar.indexOf(';'+itemId+':') >= 0)
        //     this.model.similar = this.model.similar.replace(';'+itemId+':'+(action==='A'?'F':'A')+';',';'+itemId+':'+action+';');
        // else
        //     this.model.similar += itemId+':'+action+';';
        this.model.similar[itemId] = iloveit;
    }


}