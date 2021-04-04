import {Component} from '@angular/core';
import {InitModel} from "./init-model.model";
import {EvaluationService} from "./evaluation.service";
import {ceil} from "mathjs";
import {Grid} from "./grid.model";

const getInitialModel: () => InitModel = () => {
	const
		l = 4,
		L = 4,
		lambda = 2,
		c = 1e14; // 299.792458e12,

	return {
		l,
		L,
		c,
		lambda,
		T: lambda / c, // 1.76e-14

		mode: "slider",
		gridConfig: {
			I: 100,
			K: 100,
			by: "z"
		}
	}
};

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

			<plot [grid]="grid" [mode]="model.mode">
			</plot>
		</main>
	`
})
export class AppComponent {

	grid: Grid;

	constructor(private evalService: EvaluationService) {
		this.model = getInitialModel();
	}

	private _model: InitModel;

	get model(): InitModel {
		return this._model;
	}

	set model(model: InitModel) {
		this._model = model;
		this.resolveTimeDensity(model);
		this.grid = this.evalService.evaluate(model);
	}

	/**
	 * based on assumption that TcI <= KL
	 */
	resolveTimeDensity(model: InitModel): void {
		model.gridConfig.K = ceil(model.T * model.c * model.gridConfig.I / model.L);
	}

}
