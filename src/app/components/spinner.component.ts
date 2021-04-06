import {Component, Input} from '@angular/core';

@Component({
	selector: 'spinner',
	template: `
		<div *ngIf="enabled" class="spinner__inner" id="loader">
			<div class="spinner__border"></div>
		</div>
	`
})
export class SpinnerComponent {

	@Input()
	enabled: boolean;

}
