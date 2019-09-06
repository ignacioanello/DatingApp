import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {

    constructor(private userService: UserService,
        private router: Router,
        private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        // OBTENGO LOS DATOS ANTES DE ACTIVAR LA RUTA EN SI.

        // Cuando usamo un resolve no hace falta suscribirnos al observer
        // lo hace automaticamente.
        // Lo que queremos hacer es agarrar cualquier error que haya y redirigir
        // al usuario y salir de este metodo.
        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data from: MemberDetailResolver component');
                this.router.navigate(['/members']);
                return of(null); // 'of' es un tipo de Observable.
            })
        );
    }
}
