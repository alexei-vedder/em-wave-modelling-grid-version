import {Component, EventEmitter, Input, Output} from "@angular/core";

export interface BooleanFieldItem {
	id: string;
	text: string;
}

@Component({
	selector: "radio-group-field",
	template: `
		<fieldset class="radio-group-field__inner">
			{{text}}
			<div class="radio-group-field__wrapper">
				<label *ngFor="let item of items" class="radio-group-field__label">
					<input class="radio-group-field__field"
						   type="radio"
						   [attr.name]="name"
						   [checked]="itemChecked(item)"
						   (change)="change(item)">
					<span class="radio-group-field__text">{{item.text}}</span>
				</label>
			</div>
		</fieldset>
	`
})
export class RadioGroupFieldComponent {

	@Input()
	public text: string = "abcd";

	@Input()
	public name: string;

	@Input()
	public items: BooleanFieldItem[];

	@Input()
	public value: BooleanFieldItem;

	@Output()
	public valueChange: EventEmitter<BooleanFieldItem> = new EventEmitter<BooleanFieldItem>();

	public change(item: BooleanFieldItem): void {
		this.value = item;
		this.valueChange.emit(this.value);
	}

	public itemChecked(item: BooleanFieldItem): boolean {
		return JSON.stringify(item) === JSON.stringify(this.value);
	}
}
