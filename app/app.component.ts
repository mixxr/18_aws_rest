import { Component, Input, Output } from '@angular/core';

import { MsBudget} from './ms-budget';
import { BudgetFormComponent } from './budget-form.component';
import { CartItemList } from './cart-item-list.component';

@Component({
    selector: 'my-app',
    //providers: [HTTP_PROVIDERS], // alternative to the bootstrap config
    template: `
        <cart-item-list></cart-item-list>
    `,
    directives: [CartItemList]
})
export class AppComponent { 
   
}
