import { AbstractControl, ValidationErrors } from "@angular/forms";

export function cannotBeginWithSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string)?.startsWith(' ')) {
        return { cannotBeginWithSpace: true, message: 'Can not begin with Space' };
    }

    return null;
}