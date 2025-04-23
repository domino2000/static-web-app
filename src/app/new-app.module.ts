import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NewAppComponent } from './new-app.component';

@NgModule({
  declarations: [
    NewAppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [NewAppComponent]
})
export class NewAppModule { }