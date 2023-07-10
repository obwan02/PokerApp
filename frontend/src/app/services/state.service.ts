import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Move, Player, Round, PlayerStatus, TurnState } from 'src/app/models/state'

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
		UPDATE_PLAYERS: 'update_players' // recieve
	};

	socket?: Socket;

	playerJoined: EventEmitter<void> = new EventEmitter();
	roundStarted: EventEmitter<void> = new EventEmitter();
	turnTaken: EventEmitter<Move> = new EventEmitter();
	nextStage: EventEmitter<void> = new EventEmitter();
	roundEnded: EventEmitter<void> = new EventEmitter();

	constructor() { }

	private registerEvents() {
		this.socket?.on(StateService.EVENT_TYPES.UPDATE_PLAYERS, (players) => {
			this.preRoundPlayers = players;
			this.playerJoined.emit();
		});

		this.socket?.on(StateService.EVENT_TYPES.START, (round) => {
			this.round = round;
			this.roundStarted.emit();
		});

		this.socket?.on(StateService.EVENT_TYPES.TURN_TAKEN, ({ round, turnState, move }) => {
			this.round = round;
			this.turnTaken.emit(move);

			if (turnState == TurnState.NextTurn) {
				this.nextStage.emit();
			}

			if (turnState == TurnState.End) {
				this.roundEnded.emit();
			}
		});
	}

	join(host: string, name: string, chips: number): Observable<void> {
		this.socket = io(host);
		this.playerName = name;

		// register events
		this.registerEvents();

		return new Observable(observer => {

			if (!this.socket) {
				observer.error();
				return;
			}

			this.socket?.emitWithAck(StateService.EVENT_TYPES.REGISTER, name, chips).then((_: any) => {
				// todo: set round
				observer.next();
			});
		});
	}

	start(): void {
		this.socket?.emit(StateService.EVENT_TYPES.START);
	}

	fold(): void {
		this.socket?.emit(StateService.EVENT_TYPES.ACTION, "fold")
	}

	call(): void {
		this.socket?.emit(StateService.EVENT_TYPES.ACTION, "call")
	}

	raise(amount: number): void {
		this.socket?.emit(StateService.EVENT_TYPES.ACTION, "raise", amount)
	}

	currentPlayer(): Player | undefined {
		return this.round?.game.players[this.round?.playerIndex];
	}

	currentPlayerStatus(): PlayerStatus | undefined {
		return this.round?.playerStatuses[this.round?.playerIndex]
	}

	currentPlayerBet(): number | undefined {
		return this.round?.playerBets[this.round?.playerIndex];
	}
}
