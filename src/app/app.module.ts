import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NumberInputComponent} from "./components/number-input.component";
import {FormsModule} from "@angular/forms";
import {InitPlotDataComponent} from "./components/init-plot-data.component";
import {PlotComponent} from "./components/plot.component";

import {PlotlyViaWindowModule} from 'angular-plotly.js';
import {RadioGroupFieldComponent} from './components/radio-group-field.component';
import {SpinnerComponent} from './components/spinner.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
	declarations: [
		AppComponent,
		NumberInputComponent,
		InitPlotDataComponent,
		PlotComponent,
		RadioGroupFieldComponent,
		SpinnerComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		PlotlyViaWindowModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
