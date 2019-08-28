import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() valuesFromHome: any;
  // Output properties emiten eventos.
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(
      () => this.alertify.success('Registration Seccessful'),
      error => this.alertify.error(error)
    );
  }

  cancel() {
    // este ejemplo como es muy simple, simplemente retorno false, puede ser cualqueir cosa.
    this.cancelRegister.emit(false);
    // console.log('Cancelled');
  }
}
