import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../../shared/services/users.service';
import { UserType } from '../../shared/models/UserType';

@Component({
  selector: 'app-login',
  imports: [Button, IconField, InputIcon, InputText, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.prepareForm();
  }

  private prepareForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmitForm() {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe({
        next: () => {
          this.authService.getCurrentUserId().subscribe((userId) => {
            this.usersService.getUserById(userId!).subscribe((user) => {
              if (user!.userType === UserType.Customer)
                this.router.navigate(['']);
              else this.router.navigate(['dashboard']);
            });
          });
        },
      });
    }
  }
}
