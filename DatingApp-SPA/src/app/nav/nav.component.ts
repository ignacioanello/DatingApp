import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    // tslint:disable-next-line: comment-format
    //Siempre hay que suscribirse a un Observable.
    this.authService.login(this.model).subscribe(
      response => {
        this.alertify.success('Logged in successfully!!');
        console.log(localStorage.getItem('token'));
      },
      error => {
        this.alertify.error('Failed to login');
        // return console.log('Failed to login: ', { error });
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    console.log('token: ' + localStorage.getItem('token'));
    this.alertify.message('Logged Out!');
  }
}

