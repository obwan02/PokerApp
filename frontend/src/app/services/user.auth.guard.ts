import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { StateService } from "./state.service";

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(private stateService: StateService, private router: Router) {}

  canActivate() {
    var isConnected = this.stateService.currentPlayer != null &&
      this.stateService.socket != null &&
      this.stateService.socket.connected; 

    if (!isConnected) {
      this.router.navigate(['/join']);
      return false;
    }

    return true;
  }
}