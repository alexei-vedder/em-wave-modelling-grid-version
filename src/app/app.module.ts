import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NumberInputComponent} from "./number-input.component";
import {FormsModule} from "@angular/forms";
import {InitPlotDataComponent} from "./init-plot-data.component";
import {PlotComponent} from "./plot.component";

import {PlotlyViaWindowModule} from 'angular-plotly.js';
import {EvaluationService} from "./evaluation.service";


@NgModule({
	declarations: [
		AppComponent,
		NumberInputComponent,
		InitPlotDataComponent,
		PlotComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		PlotlyViaWindowModule
	],
	providers: [
		EvaluationService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
