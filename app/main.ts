import { bootstrap }    from '@angular/platform-browser-dynamic';
import { provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
import { MsSearchSvc } from "./ms-search-svc"

bootstrap(AppComponent, [
  provideForms(),
  MsSearchSvc,
  HTTP_PROVIDERS
 ])
 .catch((err: any) => console.error(err));
