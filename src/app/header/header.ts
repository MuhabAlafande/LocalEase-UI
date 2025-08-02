import {Component, signal} from '@angular/core';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [
    IconField,
    InputIcon,
    InputText,
    FormsModule,
    Button
  ],
  styleUrl: './header.css'
})
export class Header {
  searchText = signal("");

  onSearchClick() {
    console.log(this.searchText());
  }

  browseByCategoryClick() {
    console.log("Browse by category");
  }

  browseByRegionClick() {
    console.log("Browse by region");
  }

  login() {
    console.log("Login");
  }

  register() {
    console.log("Register");
  }
}
