import { Injectable } from '@angular/core';
declare let alertify: any;
// Al TSLint se le dice que no arroje errores, porque si bien no lo estamos importanto, sabemos que esta
// disponible en angular.js


@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  // Hago un Wrap de los metodos asi despues los utilizo injectando el servicio 
  // y si necesito modificar algo es en un solo lugar
  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, function(e) {
      if (e) {
        okCallback();
      } else {}
    });
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
