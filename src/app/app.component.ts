import {Component} from '@angular/core';
import {InitModel} from "./init-model";
import {EvaluationService, Grid} from "./evaluation.service";

export const INITIAL_MODEL: InitModel = {
	l: 10,
	L: 4,
	c: 299.792458e12,
	lambda: 2,
	T: 6.67e-15,
	gridConfig: {
		I: 12,
		K: 11
	}
}

@Component({
	selector: 'app-root',
	template: `
		<header class="header">
			<h1 class="title header__title">EM wave model / Grid version</h1>
			<h3 class="header__subtitle">By Golubev & Vedernikov, 6408</h3>
		</header>

		<main class="root">
			<init-plot-data [(model)]="model">
			</init-plot-data>

			<plot [grid]="grid">
			</plot>
		</main>
	`
})
export class AppComponent {

	grid: Grid;

	constructor(private evalService: EvaluationService) {
		this.model = INITIAL_MODEL;
	}

	private _model: InitModel;

	get model(): InitModel {
		return this._model;
	}

	set model(model: InitModel) {
		this._model = model;
		this.grid = this.evalService.evaluate(model);
	}


}
