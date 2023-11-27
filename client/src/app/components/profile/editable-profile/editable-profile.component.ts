import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NgIf } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { BaseForm } from '../../../core/interfaces/forms/base-form.interface';
import { IProfileForm } from '../../../core/interfaces/forms/profile-form.interface';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import { Router } from '@angular/router';
import { IProfile } from '../../../core/interfaces/user/user.inteface';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileUploadService } from '../../../core/services/file-upload/file-upload.service';

@Component({
  selector: 'app-editable-profile',
  templateUrl: './editable-profile.component.html',
  styleUrls: ['./editable-profile.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    NgIf,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
  ],
})
export class EditableProfileComponent implements OnInit, OnDestroy {
  public readonly defaultColor: ThemePalette | undefined = 'primary';
  public editMode: boolean = false;

  public profileForm!: FormGroup<BaseForm<IProfileForm>>;
  public submitted: boolean = false;
  public error: string = '';

  private userProfileSubscription!: Subscription;
  private editProfileSubscription!: Subscription;

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly fileUploadService = inject(FileUploadService);
  private readonly router = inject(Router);

  public userProfile!: IProfile;

  ngOnInit() {
    const id = this.userService.currentUser.value?.id;
    if (id) {
      this.userProfileSubscription = this.userService
        .fetchUserProfileById(id)
        .subscribe({
          next: (profile) => {
            this.userProfile = {
              userId: profile?.userId || '',
              fullName: profile?.fullName || '',
              avatar: profile?.avatar || '',
            };
          },
          error: (err) => {
            this.error = err.error.message;
          },
        });
    }
  }

  public onEditToggle() {
    this.editMode = true;
    this.profileForm = this.fb.nonNullable.group({
      fullName: [this.userProfile?.fullName || '', [Validators.required]],
      avatar: [this.userProfile?.avatar || '', []],
    });
  }

  public onSubmit() {
    if (!this.profileForm.invalid) {
      this.error = '';
      this.submitted = true;

      const { fullName } = this.profileForm.getRawValue();

      const newProfile: IProfile = {
        userId: this.userProfile.userId,
        fullName,
        avatar: this.userProfile.avatar,
      };

      this.editProfileSubscription = this.userService
        .updateUserProfile(newProfile)
        .subscribe({
          next: (response) => {
            this.submitted = false;
            this.editMode = false;

            const { fullName } = this.profileForm.getRawValue();

            this.userProfile = {
              ...this.userProfile,
              fullName,
            };
          },
          error: (err) => {
            this.error = err.error.message;
          },
        });
    }
  }

  public onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;

    if (element.files?.length) {
      this.fileUploadService.fileUpload(element.files[0]).subscribe({
        next: (response) => {
          this.userProfile.avatar = response.url;
        },
        error: (err) => {
          console.log('File', err);
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.userProfileSubscription) {
      this.userProfileSubscription.unsubscribe();
    }

    if (this.editProfileSubscription) {
      this.editProfileSubscription.unsubscribe();
    }
  }
}
