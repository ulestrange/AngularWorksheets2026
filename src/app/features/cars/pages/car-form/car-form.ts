import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car, CreateCarDto } from '../../models/car';
import { CarService } from '../../services/car.service';
import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import {notBlank} from '../../../../shared/validators/not-blank.validator';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, MatFormFieldModule, 
    MatInputModule, MatButtonModule,
  MatProgressBarModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {

  private carService = inject(CarService);

  private router = inject(Router);

  private snackBar = inject(MatSnackBar);


  private formBuilder = inject(FormBuilder);

readonly currentYear = new Date().getFullYear();

  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), notBlank]],
    model: ['', [Validators.required,  Validators.maxLength(30)]],
    year: this.formBuilder.control<number | null>(null, [Validators.min(1950), Validators.max(this.currentYear + 1),]),
  });


  saving = signal(false);
  saveError = signal<string | null>(null);

  onSubmit(): void {

    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    this.carForm.disable();

    const { make, model, year } = this.carForm.getRawValue();
    const newCar: CreateCarDto = { make, model, year: year ?? undefined };

    this.saving.set(true);
    this.saveError.set(null);

    this.carService.addCar(newCar).subscribe({
      next: (response) => {
        this.snackBar.open(`${newCar.make} ${newCar.model} saved`, 'Close', { duration: 10000 });
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']);
      },
    error: (err: Error) => {
      this.saveError.set(err.message);
      this.saving.set(false);
      this.carForm.enable();
    },
    });
  }
}


