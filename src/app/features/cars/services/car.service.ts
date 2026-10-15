import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {


private http = inject(HttpClient);

private readonly apiUrl = 'http://localhost:3006/api/v1/cars'; // this should be read from an env variable we will leave it for now.

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl)
  }


}