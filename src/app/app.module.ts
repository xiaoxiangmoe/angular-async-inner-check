import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChildViewComponent } from './child-view/child-view.component';
import { AsyncInnerCheckPipe } from './async-inner-check.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChildViewComponent,
    AsyncInnerCheckPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
