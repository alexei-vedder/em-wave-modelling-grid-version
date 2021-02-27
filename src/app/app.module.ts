import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NumberInputComponent} from "./number-input.component";
import {FormsModule} from "@angular/forms";
import {InitPlotDataComponent} from "./init-plot-data.component";
import {PlotComponent} from "./plot.component";

@NgModule({
    declarations: [
        AppComponent,
        NumberInputComponent,
        InitPlotDataComponent,
        PlotComponent
    ],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
