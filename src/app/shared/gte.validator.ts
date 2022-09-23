import { AbstractControl, ValidationErrors } from "@angular/forms";

export function onlyNumber(control: AbstractControl): ValidationErrors | null {
    const v = +control.value;

    if (v == 0) {
        return { onlyNumber: true, message: 'Please enter a valid number' };
    }

    return null;
}