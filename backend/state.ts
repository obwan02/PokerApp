class Player {
	constructor(public id: string, public name: string, public chips: number) { }
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

	constructor(public game: Game) {
		this.playerStatuses = Array(this.game.players.length).fill(PlayerStatus.Playing)
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

	getPlayerById(id: string) {
		return this.players.find(player => player.id == id)
	}

	startRound(): Round {
		return new Round(this)
	}
}


