import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { TurnState, Player, Round } from 'src/app/models/state'

@Injectable({
  providedIn: 'root'
})
export class StateService {
  
  round?: Round;
  playerName?: string;
  preRoundPlayers: Player[] = [];

  static EVENT_TYPES = {
    REGISTER: 'register', // send
    START: 'start', // send and recieve
    ACTION: 'action', // send
    TURN_TAKEN: 'turn_taken', // recieve
    NEW_PLAYER: 'new_player' // recieve
  };

  socket?: Socket;

  playerJoined: EventEmitter<void> = new EventEmitter();
  roundStarted: EventEmitter<void> = new EventEmitter();
  turnTaken: EventEmitter<void> = new EventEmitter();

  constructor() {}

  private registerEvents() {
    this.socket?.on(StateService.EVENT_TYPES.NEW_PLAYER, (players) => {
      // todo: set round
      this.preRoundPlayers = players;
      this.playerJoined.emit();
    });

    this.socket?.on(StateService.EVENT_TYPES.START, (round) => {
      // todo: set round
      this.round = round;
      this.roundStarted.emit();
    });

    this.socket?.on(StateService.EVENT_TYPES.TURN_TAKEN, (round) => {
      // todo: set round
      this.round = round;
      this.turnTaken.emit();
    });
  }

  join(host: string, name: string, chips: number): Observable<void> {
    this.socket = io(host);
    this.playerName = name;

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
        // todo: set round
        observer.complete();
      });
    });
  }
}
