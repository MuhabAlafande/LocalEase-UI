import { Component, inject, signal } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { PlacesService } from '../../shared/services/places.service';
import { UserType } from '../../shared/models/UserType';
import { ServicesCategoriesService } from '../../shared/services/services-categories.service';
import { Button } from 'primeng/button';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    IconField,
    InputIcon,
    InputText,
    FormsModule,
    AutoComplete,
    ReactiveFormsModule,
    Button,
    AsyncPipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly placesService = inject(PlacesService);
  private readonly servicesCategoriesService = inject(
    ServicesCategoriesService,
  );
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm!: FormGroup;

  places = this.placesService
    .getAllPlaces()
    .pipe(map((places) => places.map((place) => place.name)));
  userTypes = signal<UserType[]>([]);
  showCategoriesField = signal<boolean>(false);
  servicesCategories = this.servicesCategoriesService
    .getAllServicesCategories()
    .pipe(map((categories) => categories.map((category) => category.name)));

  ngOnInit() {
    this.registerForm = this.prepareForm();
  }

  private prepareForm() {
    return this.formBuilder.group({
      id: [0, Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      location: ['', Validators.required],
      userType: ['', Validators.required],
      serviceCategory: [''],
    });
  }

  filterPlaces(event: AutoCompleteCompleteEvent) {
    this.places = this.placesService
      .filterPlaces(event.query)
      .pipe(map((places) => places.map((place) => place.name)));
  }

  getUserTypes() {
    this.userTypes = signal([UserType.Customer, UserType.ServiceProvider]);
  }

  onSelectUserType() {
    if (this.registerForm.get('userType')?.value === UserType.ServiceProvider) {
      this.showCategoriesField.set(true);
    } else {
      this.showCategoriesField.set(false);
      this.registerForm.get('serviceCategory')?.setValue('');
    }
  }

  filterServicesCategories(event: AutoCompleteCompleteEvent) {
    this.servicesCategories = this.servicesCategoriesService
      .filterServicesCategories(event.query)
      .pipe(map((categories) => categories.map((category) => category.name)));
  }

  onSubmitForm() {
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['']),
      });
    }
  }
}
