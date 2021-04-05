import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NumberInputComponent} from "./components/number-input.component";
import {FormsModule} from "@angular/forms";
import {InitPlotDataComponent} from "./components/init-plot-data.component";
import {PlotComponent} from "./components/plot.component";

import {PlotlyViaWindowModule} from 'angular-plotly.js';
import {RadioGroupFieldComponent} from './components/radio-group-field.component';


@NgModule({
	declarations: [
		AppComponent,
		NumberInputComponent,
		InitPlotDataComponent,
		PlotComponent,
		RadioGroupFieldComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		PlotlyViaWindowModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
