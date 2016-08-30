import {Component, EventEmitter, Output, OnChanges, Input, SimpleChanges} from "@angular/core";

import {MsCartItem} from "./ms-cart-item";
import {MsBudget} from "./ms-budget";
import {MsSearchSvc} from "./ms-search-svc";


@Component({
    selector: 'cart-item-list',
    template:`<div>{{message}}:<br/>
        <br/>
        <table class="table table-striped table-hover">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Description</th>
            </tr>
            <tr *ngFor="let myItem of list" (click)="select(myItem.id)">   
                <td>{{myItem.id}}</td>             
                <td>{{myItem.name}}</td>
                <td>{{myItem.price}}</td>
                <td>{{myItem.qty}}</td>
                <td>{{myItem.description}}</td>
            </tr>
        </table>
    </div>`
})

export class CartItemList implements OnChanges{
    @Input() budget: MsBudget;
    @Output() onSelect = new EventEmitter<number>();
    
    message = "Your bargain";
    list:MsCartItem[];

    constructor(public searchSvc:MsSearchSvc){
        console.log('constructor>hero-list:',this.list);
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('form>budget: ', changes['budget'].currentValue);
        this.searchSvc.getList(changes['budget'].currentValue)
            .subscribe(
                list => this.list = list,
                error => this.message = <any>error);
    }
    
    ngOnInit() {
    }

    select(itemId:number){
        console.log('select:', itemId);
        
        this.onSelect.emit(itemId);
    }

}