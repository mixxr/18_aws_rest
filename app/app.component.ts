import { Component, Input, Output } from '@angular/core';

@Component({
    selector: 'my-app',
    //providers: [HTTP_PROVIDERS], // alternative to the bootstrap config
    template: `
        <cart-item-list></cart-item-list>
    `
})
export class AppComponent { 
   
}
