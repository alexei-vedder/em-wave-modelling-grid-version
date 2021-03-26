import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'number-input',
    template: `
        <div class="number-input">
            {{text}}
            <div class="number-input__wrapper">
                <button (click)="decrement()" class="number-input__decrease-button">-</button>
                <input class="number-input__input" [(ngModel)]="value" (ngModelChange)="valueChange.emit($event)"
                       type="number" [step]="step"/>
                <button (click)="increment()" class="number-input__increase-button">+</button>
            </div>
        </div>
    `
})
export class NumberInputComponent {

    @Output()
    valueChange: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    step: number;

    @Input()
    value: number;

    @Input()
    text: string;

    decrement() {
        this.value -= this.step;
        this.valueChange.emit(this.value);
    }

    increment() {
        this.value += this.step;
        this.valueChange.emit(this.value);
    }
}
