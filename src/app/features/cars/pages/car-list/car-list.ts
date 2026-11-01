import { Component,  inject,  } from '@angular/core';

import { CarService } from '../../services/car.service';
import { Observable } from 'rxjs';
import { CarCard } from '../car-card/car-card';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-car-list',
  imports: [ CarCard],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarList  {

private carService = inject(CarService);
  

   cars = toSignal(this.carService.getCars());
}


