import { Component, Input, Output } from '@angular/core';

import { MsBudget} from './ms-budget';
import { BudgetFormComponent } from './budget-form.component';
import { CartItemList } from './cart-item-list.component';

@Component({
    selector: 'my-app',
    //providers: [HTTP_PROVIDERS], // alternative to the bootstrap config
    template: `
        <budget-form [itemId]="itemId" (notify)="changeBudget($event)"></budget-form>
        <hr/>
        <cart-item-list (onSelect)="changeItem($event)" [budget]="budget"></cart-item-list>
    `,
    directives: [BudgetFormComponent, CartItemList]
})
export class AppComponent { 
    itemId:number;
    budget: MsBudget;

    changeItem(event:number){
        console.log('parent>itemId:', event);
        this.itemId = event;
    }

    changeBudget(event:MsBudget){
        console.log('parent>budget:', event);
        this.budget = event;
    }
}
