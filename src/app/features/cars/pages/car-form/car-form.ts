import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car } from '../../models/car';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {

   private fb = inject(FormBuilder);

   carForm = this.fb.group({
     make: ['', Validators.required],
     model: ['', Validators.required],
     year: ['']
   });


onSubmit(): void {
    if (this.carForm.valid) {
      // Cast the form value directly to your Car interface
      const carData: Car = this.carForm.value as Car;
      console.log('Submitted Car:', carData);
      
      // TODO: Send carData to your backend service
    } 
  }

}
