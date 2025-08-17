import { Component, inject } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { LoaderService } from './loader.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [ProgressSpinner, AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  private readonly loaderService = inject(LoaderService);

  loaderState$ = this.loaderService.loaderState;
}
