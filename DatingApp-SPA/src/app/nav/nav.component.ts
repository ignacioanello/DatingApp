import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    // tslint:disable-next-line: comment-format
    //Siempre hay que suscribirse a un Observable.
    this.authService.login(this.model).subscribe(
      response => {
        console.log('Logged in successfully!!');
        console.log(localStorage.getItem('token'));
      },
      error => {
        return console.log('Failed to login: ', { error });
      }
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true o false
  }

  logout() {
    localStorage.removeItem('token');
    console.log('token: ' + localStorage.getItem('token'));
    console.log('Logged Out!');
  }
}

