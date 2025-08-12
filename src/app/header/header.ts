import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [FormsModule],
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);
  isLoggedIn = computed(() => this.authService.isLoggedIn());
}
