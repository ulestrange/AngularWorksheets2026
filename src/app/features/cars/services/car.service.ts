import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, throwError } from 'rxjs';
import { Car, CreateCarDto, UpdateCarDto } from '../models/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {


  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3006/api/v1/cars'; // this should be read from an env variable we will leave it for now.

  getCars(): Observable<Car[]> {
    return this.http
      .get<Car[]>(this.apiUrl)
  }


  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`)
  }

  addCar(car: CreateCarDto): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car)

  }
  updateCar(id: string, changes: UpdateCarDto): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, changes);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }




}