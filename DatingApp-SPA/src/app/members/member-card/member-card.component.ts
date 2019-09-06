import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})

export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  loadUser(id: number) {
    this.userService.getUser(id).subscribe(
      (user: User) => {
        this.user = user;
      },
      error => {
        this.alertify.error(error);
      });
  }

}
