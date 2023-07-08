import assert from 'assert';

enum RoundState {
  PreFlop = 0,
  Flop = 1,
  Turn = 2,
  River = 3,
  Showdown = 4
}

enum PlayerStatus {
  Folded,
  Playing
}

enum MoveType {
  Raise,
  Call,
  Fold
}

enum TurnState {
  Continue,
  NextTurn,
  End
}

class Player {
  constructor(
    public id: string,
    public name: string,
    public chips: number
  ) {}
}

class Move {
  constructor(
    public moveType: MoveType,
    public raiseAmount?: number
  ) {}
}

class Round {
  game: Game;
  state: RoundState = RoundState.PreFlop;
  currentPot: number = 0;
  currentBet: number = 0;
  playerIndex: number = 0;
  lastRaiseIndex: number = 0;

  playerStatuses: PlayerStatus[];
  playerBets: number[];

  constructor(game: Game) {
    this.game = game;
    this.playerStatuses = Array(this.game.players.length).fill(PlayerStatus.Playing);
    this.playerBets = Array(this.game.players.length).fill(0);
  }

  currentPlayer(): Player {
    return this.game.players[this.playerIndex];
  }

  currentPlayerStatus(): PlayerStatus {
    return this.playerStatuses[this.playerIndex];
  }

  currentPlayerBet(): number {
    return this.playerBets[this.playerIndex];
  }

  playMove(move: Move, player?: Player): TurnState {
    assert(!player || player.id == this.currentPlayer().id);
    assert(this.currentPlayerStatus() != PlayerStatus.Folded);

    switch (move.moveType) {
      case MoveType.Fold:
        this.playerStatuses[this.playerIndex] = PlayerStatus.Folded;
        break;

      case MoveType.Call:
        this.playerBets[this.playerIndex] = this.currentBet;

        let diff = this.currentBet - this.currentPlayerBet();
        this.currentPlayer().chips -= diff;
        this.currentPot += diff;
        break;

      case MoveType.Raise:
        assert(move.raiseAmount);
        assert(this.currentPlayerBet() + move.raiseAmount >= this.currentBet);

        this.currentPlayer().chips -= move.raiseAmount;
        this.currentBet += move.raiseAmount;
        this.currentPot += move.raiseAmount;
        this.lastRaiseIndex = this.playerIndex;
        break;
      default:
        assert(false);
    }

    this.playerIndex = (this.playerIndex + 1) % this.playerStatuses.length;
    if (this.playerIndex == this.lastRaiseIndex) {
      return TurnState.NextTurn;
    }

    let numNotFolded = this.playerStatuses.filter((x) => x != PlayerStatus.Folded).length;
    if (numNotFolded <= 1) {
      return TurnState.End;
    }

    return TurnState.Continue;
  }

  genNextRound(): Round | null {
    let clone = { ...this };
    clone.state += 1;

    return clone.state > RoundState.Showdown ? null : clone;
  }
}

class Game {
  players: Player[];

  constructor() {
    this.players = [];
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  getPlayerById(id: string): Player | undefined {
    return this.players.find((player) => player.id == id);
  }

  nextRound(): Round {
    let round = new Round(this);
    // rotate the players
    this.players = [...this.players.slice(-1), ...this.players.slice(0, -1)];
    return round;
  }
}

export { Game, Round, Player, Move, RoundState, PlayerStatus, MoveType, TurnState };
