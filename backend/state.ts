class Player {
	constructor(public name: string, public chips: number) { }

}

enum RoundState {
	PreFlop,
	Flop,
	Turn,
	River,
	Showdown
};

enum PlayerStatus {
	Folded,
	Playing
};

class Round {
	state: RoundState = RoundState.PreFlop;
	currentPot: number = 0;
	dealerIndex: number = 0;

	playerStatuses: PlayerStatus[];

	constructor(players: Player[]) {
		this.playerStatuses = Array(players.length).fill(PlayerStatus.Playing)
	}
}

class Game {
	players: Player[];

	constructor() {
		this.players = [];
	}

	addPlayer(player: Player) {
		this.players.push(player)
	}

	makeMove() {

	}
}


