import {Injectable} from '@angular/core';
import {pi, sin, square, transpose} from 'mathjs';
import {InitModel} from "./init-model.model";
import {Grid} from "./grid.model";

@Injectable()
export class EvaluationService {

	private static createGridTemplate(from: { z, t }, to: { z, t }, I, K, valueConstraints: { min, max }): Grid {
		const zRange = EvaluationService.tabulateRange(from.z, to.z, I + 1);
		const tRange = EvaluationService.tabulateRange(from.t, to.t, K + 1);
		const values = new Array(zRange.length).fill(null)
			.map(() => new Array(tRange.length).fill(NaN));
		return {
			values,
			range: {
				z: zRange,
				t: tRange
			},
			hz: (to.z - from.z) / (I),
			ht: (to.t - from.t) / (K),
			valueConstraints,
			by: "t"
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

		const {c, lambda, l, L, T} = model,
			{I, K} = model.gridConfig;

		const grid = EvaluationService.createGridTemplate(
			{z: 0, t: 0},
			{z: L, t: T},
			I,
			K,
			{
				min: -l / 2,
				max: l / 2
			}
		);

		const {ht, hz, values: u} = grid,
			{min: minValue, max: maxValue} = grid.valueConstraints,
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

		const a = square(ht),
			b = square(c / hz);

		for (let k = 1; k <= K - 1; ++k) {
			for (let i = 1; i <= I - 1; ++i) {

				const d1 = u[i + 1][k],
					d2 = u[i][k],
					d3 = u[i - 1][k],
					d = d1 - 2 * d2 + d3,
					e = greekPi * u[i][k],
					g = (2 * u[i][k]) - u[i][k - 1],
					h = b * d;

				const finalValue = a * (h - e) + g;

				u[i][k + 1] = finalValue < minValue ? minValue : maxValue < finalValue ? maxValue : finalValue;
			}
		}

		if (model.gridConfig.by === "z") {
			grid.values = transpose(grid.values);
			grid.by = "z";
		}

		return grid;
	}
}
