import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  socket?: Socket;

  constructor() {

  }

  join(host: string, name: string, chips: number): Observable<void> {
    this.socket = io(host);

    return new Observable(observer => {
      
      if(!this.socket) {
        observer.error();
        return;
      }

      this.socket.emit('register', {
        name,
        chips
      }, (_: any) => {
        observer.complete();
      });
    });
    
  }



}
