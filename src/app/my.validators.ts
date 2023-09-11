import { AbstractControl, ValidatorFn } from '@angular/forms';

export function groupNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const groupNumberPattern = /^\d{2}-\d{2}$/;

    if (control.value && !groupNumberPattern.test(control.value)) {
      return { invalidGroupNumber: true };
    }

    return null;
  };
}
