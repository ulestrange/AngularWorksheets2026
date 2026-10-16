import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Car } from '../../models/car';
import { CarService } from '../../services/car.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-car-details',
  imports: [AsyncPipe],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails  implements OnInit {
  private route = inject(ActivatedRoute);
  private carService = inject(CarService);

  car$ : Observable<Car> | undefined
  loading = true;
  error = '';

  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
    this.car$ = this.carService.getCarById(id)

    }
  }
}
