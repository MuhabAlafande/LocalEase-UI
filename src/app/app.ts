import { Component, inject } from '@angular/core';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './shared/services/auth.service';
import { UsersService } from './shared/services/users.service';
import { UserType } from './shared/models/UserType';

@Component({
  selector: 'app-root',
  imports: [LoaderComponent, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  protected userType!: UserType;
  private isInitialCall = true;

  ngOnInit(): void {
    if(this.isInitialCall){
      this.authService.getCurrentUserId().subscribe((userId) => {
        if (userId !== undefined) {
          this.usersService.getUserById(userId).subscribe((user) => {
            if (user !== null) {
              this.userType = user.userType;
              // if(this.userType == UserType.ServiceProvider) this.router.navigate(['dashboard']);

              this.isInitialCall = false;
            }
          });
        }
      });
    }
  }

  protected readonly UserType = UserType;
}
