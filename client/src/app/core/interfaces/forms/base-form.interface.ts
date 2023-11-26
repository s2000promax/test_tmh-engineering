import { FormControl, FormGroup } from '@angular/forms';

export type BaseForm<T> = {
  [P in keyof T]: T[P] extends object
    ? FormGroup<BaseForm<T[P]>>
    : FormControl<T[P]>;
};
