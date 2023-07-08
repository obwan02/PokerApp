import * as assert from "assert";

enum RoundState {
	PreFlop = 0,
	Flop = 1,
	Turn = 2,
	River = 3,
	Showdown = 4
};

enum PlayerStatus {
	Folded,
	Playing
};

enum MoveType {
	Raise,
	Call,
	Fold
};

enum TurnState {
	Continue,
	NextTurn,
	End
};

class Player {
	constructor(public id: string, public name: string, public chips: number) { }
}

class Move {
	constructor(public moveType: MoveType, public raiseAmount?: number) { }
}

class Round {
	state: RoundState = RoundState.PreFlop;
	currentPot: number = 0;
	currentBet: number = 0;
	playerIndex: number = 0;
	lastRaiseIndex: number = 0;

	playerStatuses: PlayerStatus[];
	playerBets: number[];

	game: Game;
	
	constructor(game: Game, playerStatuses: PlayerStatus[], playerBets: number[]) {
		this.game = game;
		this.playerStatuses = playerStatuses;
		this.playerBets = playerBets;
	}
}

class Game {
	players: Player[];

	constructor() {
		this.players = [];
	}

	getPlayerById(id: string): Player | undefined {
		return this.players.find(player => player.id == id)
	}
}


export { Game, Round, Player, Move, RoundState, PlayerStatus, MoveType, TurnState };