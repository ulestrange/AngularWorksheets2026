import { Component, input } from '@angular/core';
import { Car } from '../../models/car';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-card',
  imports: [],
  templateUrl: './car-card.html',
  styleUrl: './car-card.scss',
})
export class CarCard {

  car = input.required<Car>();

}
