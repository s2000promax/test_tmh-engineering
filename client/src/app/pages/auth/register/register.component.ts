import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { BaseForm } from '../../../core/interfaces/forms/base-form.interface';
import { IUser } from '../../../core/interfaces/user/user.inteface';
import { emailValidator } from '../../../core/validators/email.validator';
import { IRegisterForm } from '../../../core/interfaces/forms/register-form.interface';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    NgIf,
    RouterLink,
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public readonly defaultColor: ThemePalette | undefined = 'primary';

  registerForm!: FormGroup<BaseForm<IRegisterForm>>;
  public error: string = '';
  public submitted: boolean = false;

  private registerSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.registerForm = this.fb.nonNullable.group({
      email: ['', [emailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (!this.registerForm.invalid) {
      this.error = '';
      this.submitted = true;

      this.registerSubscription = this.authService
        .register(this.registerForm.getRawValue())
        .pipe(
          switchMap((registerResponse) => {
            return this.authService.login(this.registerForm.getRawValue());
          }),
          switchMap((loginResponse) => {
            this.authService.setAccessToken(loginResponse.accessToken);
            return this.userService.fetchCurrentUser();
          }),
        )
        .subscribe({
          next: (user) => {
            this.registerForm.reset();
            this.submitted = false;

            this.userService.setCurrentUserData(user);

            this.router.navigate(['profile']);
          },
          error: (err) => {
            this.submitted = false;
            this.error = err.error.message;
          },
        });
    }
  }

  ngOnDestroy() {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }
}
