import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  socket?: Socket;

  constructor() {

  }

  join(host: string, name: string, chips: number): void {
    this.socket = io(host);

    this.socket.on('example', data => {
      
    });
  }

}
