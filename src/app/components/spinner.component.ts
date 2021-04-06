import {Component, Input} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'spinner',
	animations: [
		trigger(
			'appearingAnimation',
			[
				transition(
					':enter',
					[
						style({ height: 0, opacity: 0 }),
						animate('0.6s ease-out',
							style({ height: "100%", opacity: 1 }))
					]
				),
				transition(
					':leave',
					[
						style({ marginTop: 0, height: "100%", opacity: 1 }),
						animate('0.6s ease-in',
							style({ marginTop: "100vh", height: 0, opacity: 0 }))
					]
				)
			]
		)
	],
	template: `
		<div *ngIf="enabled" [@appearingAnimation] class="spinner__inner" id="loader">
			<div class="spinner__border"></div>
		</div>
	`
})
export class SpinnerComponent {

	@Input()
	enabled: boolean;

}
