import {Injectable} from '@angular/core';
import {pi, sin, square} from 'mathjs';
import {InitModel} from "./init-model";

export interface Grid {
	values: number[][];
	zRange: number[];
	tRange: number[];
	hz: number;
	ht: number;
}

@Injectable()
export class EvaluationService {

	private static createGridTemplate(from: { z0, t0 }, to: { zn, tn }, I, K): Grid {
		const zRange = EvaluationService.tabulateRange(from.z0, to.zn, I + 1);
		const tRange = EvaluationService.tabulateRange(from.t0, to.tn, K + 1);
		const values = new Array(zRange.length).fill(null)
			.map(() => new Array(tRange.length).fill(null));
		return {
			values,
			zRange,
			tRange,
			hz: (to.zn - from.z0) / (I),
			ht: (to.tn - from.t0) / (K)
		};
	}

	private static tabulateRange(from: number, to: number, totalPoints: number): number[] {
		if (to < from) {
			throw new Error("param 'from' should be less than param 'to'");
		}
		const tabulation: number[] = [];
		const step = (to - from) / (totalPoints - 1);
		let xCurrent = from;
		while (xCurrent < to + step / 2) {
			tabulation.push(xCurrent);
			xCurrent += step;
		}
		return tabulation;
	}

	evaluate(model: InitModel): Grid {

		const grid = EvaluationService.createGridTemplate(
			{z0: 0, t0: 0},
			{zn: model.l, tn: model.T},
			model.gridConfig.I,
			model.gridConfig.K
		);

		const {c, lambda, l} = model,
			{I, K} = model.gridConfig,
			{ht, hz, values: u} = grid,
			omega = 2 * pi * (c / lambda),
			greekPi = pi * c / l;


		for (let i = 0; i <= I; ++i) {
			u[i][0] = 0;
			u[i][1] = 0;
		}

		for (let k = 2; k <= K; ++k) {
			u[0][k] = sin(omega * k * ht);
		}

		for (let k = 1; k <= K; ++k) {
			u[I][k] = 0;
		}

		for (let k = 1; k <= K - 1; ++k) {
			for (let i = 1; i <= I - 1; ++i) {
				u[i][k + 1] = square(ht) *
					((square(c) / square(hz)) * (u[i + 1][k] - 2 * u[i][k] + u[i - 1][k]) -
						greekPi * u[i][k]
					) + (2 * u[i][k]) - u[i][k - 1];
			}
		}

		return grid;
	}
}
