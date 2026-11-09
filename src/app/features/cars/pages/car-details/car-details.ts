import { Component, inject, input, signal } from '@angular/core';

import { Car } from '../../models/car';
import { CarService } from '../../services/car.service';
import { Observable, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LoadState, withLoadState } from '../../../../shared/load-state';
import { RouterLink, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-car-details',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails {

  private readonly router = inject(Router);

  private carService = inject(CarService);

  readonly id = input.required<string>();

  readonly deleting = signal(false);
  
  readonly deleteError = signal<string | null>(null);

  readonly initial: LoadState<Car> = { status: 'loading' };

  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.carService.getCarById(id))),
    ),
    { initialValue: this.initial },
  );



deleteCar(car: Car): void {
  if (!confirm(`Delete ${car.make} ${car.model}?`)) return;

  this.deleting.set(true);
  this.deleteError.set(null);

  this.carService.deleteCar(car._id).subscribe({
    next: () => this.router.navigate(['/cars']),
    error: (err: Error) => {
      this.deleteError.set(err.message);
      this.deleting.set(false);
    },
  });
}


}


