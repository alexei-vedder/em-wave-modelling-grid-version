import {Injectable} from '@angular/core';
import {ceil, pi, sin, sqrt, transpose} from "mathjs";
import {Grid} from "../models/grid.model";
import {InitModel} from "../models/init-model.model";
import {AbstractEvaluationService} from "./abstract-evaluation.service";

@Injectable()
export class AnalyticalEvaluationService extends AbstractEvaluationService {

	private data: InitModel;

	async evaluate(model): Promise<Grid> {
		this.data = model;

		const {l, L, T, I, K} = model;

		const tabFn = this.createGridTemplate(
			{z: 0, t: 0},
			{z: L, t: T},
			I,
			K,
			{
				min: -l / 2,
				max: l / 2
			}
		);

		const N = this.findIterationNum();

		const {min: minValue, max: maxValue} = tabFn.valueConstraints;

		for (let k = 0; k < tabFn.range.t.length; ++k) {
			for (let i = 0; i < tabFn.range.z.length; ++i) {
				const value = this.findEy(tabFn.range.z[i], tabFn.range.t[k], N);
				tabFn.values[i][k] = value // < minValue ? minValue : maxValue < value ? maxValue : value;
			}
		}

		if (model.by === "z") {
			tabFn.values = transpose(tabFn.values);
			tabFn.by = "z";
		}

		return tabFn;
	}

	private findIterationNum() {
		let a1 = this.omega() ** 2 - this.omegaTop() ** 2,
			a2 = (this.data.L ** 2),
			b1 = this.data.epsilon * (pi ** 3) * (this.data.c ** 2);
		const N = ceil(sqrt(a1 * a2 / b1) - 1);
		console.log("N = ", N);
		return N;
	}

	private Ey = (z: number, x: number, t: number, n: number) => (this.U(z, t, n) + this.Teta(z, t)) * sin(pi * x);

	private U = (z: number, t: number, n: number) => {
		let series: number = 0;
		for (let i = 1; i <= n; ++i) {
			series += this.Tn(t, i) * this.Yn(z, i);
		}
		return series;
	};

	private Tn = (t: number, n: number) => (2 / ((pi * n) * ((this.gammaN(n) ** 2) - (this.omega() ** 2)))) *
		(((this.omega() ** 2) - (this.omegaTop() ** 2)) * sin(this.omega() * t) - (this.omega() * (this.omegaN(n) ** 2) * sin(this.gammaN(n) * t)) / this.gammaN(n));

	private Yn = (z: number, n: number) => sin(pi * n * z / this.data.L);

	private Teta = (z: number, t: number) => sin(this.omega() * t) * (this.data.L - z) / this.data.L;

	private omega = () => (2 * pi * this.data.c) / this.data.lambda;

	private omegaN = (n: number) => (pi * this.data.c * n) / this.data.L;

	private omegaTop = () => (this.data.c) / (pi * this.data.l ** 2);

	private gammaN = (n: number) => sqrt(this.omegaTop() ** 2 + this.omegaN(n) ** 2);

	private findEy(z: number, t: number, N: number) {
		return this.Ey(z, 1 / 2, t, N);
	}
}
