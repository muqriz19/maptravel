import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor() {}

  public displayAlerts(type: string, message: string) {
    var alertPlaceholder = document.getElementById(
      'liveAlertPlaceholder'
    ) as HTMLElement;

    var wrapper = document.createElement('div');
    wrapper.innerHTML =
      '<div class="alert alert-' +
      type +
      ' alert-dismissible" role="alert">' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

    alertPlaceholder.append(wrapper);

    setTimeout(() => {
      alertPlaceholder.innerHTML = '';
    }, 5000);
  }
}
