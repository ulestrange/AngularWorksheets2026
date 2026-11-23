import { Component, inject, Injectable, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthCustomService } from './core/auth/auth-custom.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

@Injectable({
  providedIn: 'root',
})

export class App {
  protected readonly title = signal('AngularWorksheets2026');

  protected auth = inject(AuthCustomService);
}
