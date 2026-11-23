import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCustomService } from '../../../../core/auth/auth-custom.service';
import { RegisterUserDto } from '../../../../core/models/user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,
     MatFormFieldModule, 
     MatInputModule,
    MatButtonModule,
  RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

 private authService = inject(AuthCustomService);

  private router = inject(Router);

  private formBuilder = inject(FormBuilder);

  saving = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.formBuilder.nonNullable.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]], // match the rule in your backend's Zod schema

    },

  );

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

   
    const { name, email, password } = this.registerForm.getRawValue();
    const newUser: RegisterUserDto = { name, email, password };

    this.saving.set(true)
    this.errorMessage.set(null);


    this.authService.addUser(newUser).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.saving.set(false);
        this.router.navigate(['/login']);
      },
      error: (error: Error) => {
        // the service has already turned the HTTP error into a friendly message
        console.error('Error registering user:', error);
        this.errorMessage.set(error.message);
        this.saving.set(false);
      }
    });
  }

}
