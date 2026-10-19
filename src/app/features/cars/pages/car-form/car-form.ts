import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car } from '../../models/car';
import { CarService } from '../../services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {

  private carService = inject(CarService);

  private router = inject(Router);


   private formBuilder = inject(FormBuilder);


   carForm = this.formBuilder.group({
     make: ['', Validators.required],
     model: ['', Validators.required],
     year: this.formBuilder.control<number|null> (null)
   });


onSubmit(): void {
    // if (this.carForm.valid) {
    //   // Cast the form value directly to your Car interface

    const formValue = this.carForm.value;
      const carData: Car = 
      {...formValue, year: formValue.year ?? undefined} as Car
      
      console.log('Submitted Car:', carData);
      
      this.carService.addCar(carData).subscribe({
        next: (response) => {
          console.log('Car added successfully:', response);
          this.router.navigate(['/cars']); 
        },
        error: (error) => {
          console.error('Error adding car:', error);
        }
      });
    }
  }


