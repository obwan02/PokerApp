import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { TurnState, Player, Round } from 'src/app/models/state'

@Injectable({
  providedIn: 'root'
})
export class StateService {
  

  static EVENT_TYPES = {
    REGISTER: 'register', // send
    START: 'start', // send and recieve
    ACTION: 'action', // send
    TURN_TAKEN: 'turn_taken', // recieve
    NEW_PLAYER: 'new_player' // recieve
  };

  socket?: Socket;

  playerJoined: EventEmitter<Player> = new EventEmitter();
  roundStarted: EventEmitter<Round> = new EventEmitter();
  turnTaken: EventEmitter<{turnTaken: TurnState, round: Round}> = new EventEmitter();

  constructor() {}

  private registerEvents() {
    this.socket?.on(StateService.EVENT_TYPES.NEW_PLAYER, this.playerJoined.emit);
    this.socket?.on(StateService.EVENT_TYPES.START, this.roundStarted.emit);
    this.socket?.on(StateService.EVENT_TYPES.TURN_TAKEN, this.turnTaken.emit);
  }

  join(host: string, name: string, chips: number): Observable<void> {
    this.socket = io(host);

    // register events
    this.registerEvents();

    return new Observable(observer => {
      
      if(!this.socket) {
        observer.error();
        return;
      }

      this.socket.emit(StateService.EVENT_TYPES.REGISTER, {
        name,
        chips
      }, (_: any) => {
        observer.complete();
      });
    });
  }
}
