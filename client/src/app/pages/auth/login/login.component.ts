import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { BaseForm } from '../../../core/interfaces/forms/base-form.interface';
import { emailValidator } from '../../../core/validators/email.validator';
import { Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ILoginForm } from '../../../core/interfaces/forms/login-form.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Subscription, switchMap } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit, OnDestroy {
  public readonly defaultColor: ThemePalette | undefined = 'primary';

  public loginForm!: FormGroup<BaseForm<ILoginForm>>;

  public submitted: boolean = false;
  public error: string = '';

  private loginSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [emailValidator()]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.loginForm.invalid) {
      this.error = '';
      this.submitted = true;

      this.loginSubscription = this.authService
        .login(this.loginForm.getRawValue())
        .pipe(
          switchMap((loginResponse) => {
            this.authService.setAccessToken(loginResponse.accessToken);

            return this.userService.fetchCurrentUser();
          }),
        )
        .subscribe({
          next: (user) => {
            this.loginForm.reset();
            this.submitted = false;

            this.userService.setCurrentUserData(user);

            this.router.navigate(['tasks']);
          },
          error: (err) => {
            this.submitted = false;
            this.error = err.error.message;
          },
        });
    }
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
