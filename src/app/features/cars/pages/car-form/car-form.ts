import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car, CreateCarDto } from '../../models/car';
import { CarService } from '../../services/car.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {

  private carService = inject(CarService);

  private router = inject(Router);


  private formBuilder = inject(FormBuilder);


  carForm = this.formBuilder.nonNullable.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: this.formBuilder.control<number | null>(null)
  });


  saving = signal(false);
  saveError = signal<string | null>(null);

  onSubmit(): void {

    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    const { make, model, year } = this.carForm.getRawValue();
    const newCar: CreateCarDto = { make, model, year: year ?? undefined };

    this.saving.set(true);
    this.saveError.set(null);

    this.carService.addCar(newCar).subscribe({
      next: (response) => {
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']);
      },
    error: (err: Error) => {
      this.saveError.set(err.message);
      this.saving.set(false);
    },
    });
  }
}


