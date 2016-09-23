import { NgModule, ViewContainerRef }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule, NgForm }   from '@angular/forms';
import { AppComponent }   from './app.component';
import { HttpModule }    from '@angular/http';

//import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from "ng2-material";
import { MdInputModule} from '@angular2-material/input';
import { MdSlideToggleModule} from '@angular2-material/slide-toggle';


import { CartItemList } from './cart-item-list.component';
import { MsSearchSvc} from './ms-search-svc'

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

@NgModule({
    declarations: [AppComponent, CartItemList],
    imports:      [ BrowserModule, FormsModule, HttpModule, ModalModule.forRoot(), BootstrapModalModule, MdInputModule.forRoot(), MdSlideToggleModule.forRoot() ],
    bootstrap:    [AppComponent],
    providers:[MsSearchSvc]
})
export class AppModule {}