import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CarService } from '../../services/car.service';
import { Observable } from 'rxjs';
import { Car } from '../../models/car';
import { CarCard } from '../car-card/car-card';

@Component({
  selector: 'app-car-list',
  imports: [AsyncPipe, CarCard],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarList implements OnInit {

private carService = inject(CarService);
  
  cars$!: Observable<Car[]>;

  cars2 = signal<Car[]>([]);

  ngOnInit(): void {
    this.cars$ = this.carService.getCars();

    this.carService.getCars().subscribe(cars => {
      this.cars2.set(cars);
    });
  }
}


