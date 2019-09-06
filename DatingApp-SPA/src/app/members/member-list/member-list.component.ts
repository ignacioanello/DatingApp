import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService,
    private alertify: AlertifyService,
    private activatedRoute: ActivatedRoute) {
      // OJO: no es 'route' es: 'ActivatedRoute'
    }

  ngOnInit() {
    // Esto lo hago con un resolver para contemplar el caso de que se haga el render del
    // componente antes de que se obtengan los datos. MemberDetailResolver.
    this.activatedRoute.data.subscribe(resp => {
      this.users = resp['usersListResolver'];
    },
      error => {
        this.alertify.error(error);
      });
  }
}
