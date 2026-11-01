import { Component, inject, input, signal } from '@angular/core';

import { Car } from '../../models/car';
import { CarService } from '../../services/car.service';
import { Observable, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LoadState, withLoadState } from '../../../../shared/load-state';


@Component({
  selector: 'app-car-details',
  imports: [],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails {


  private carService = inject(CarService);

  readonly id = input.required<string>();

  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.carService.getCarById(id))),
    ),
    { initialValue: { status: 'loading' } as LoadState<Car> },
  );

}


