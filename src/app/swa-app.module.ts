import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SwaAppComponent } from './swa-app.component';

@NgModule({
  declarations: [
    SwaAppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [SwaAppComponent]
})
export class SwaAppModule { }