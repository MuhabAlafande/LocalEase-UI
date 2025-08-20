import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [FormsModule, AsyncPipe],
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.signOut().then(() => this.router.navigate(['']));
  }
}
