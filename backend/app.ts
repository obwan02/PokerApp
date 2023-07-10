import { config } from 'dotenv';
import { Server } from 'http';
import express, { Application } from 'express';
import { Server as IOServer, Socket } from 'socket.io';
import { Player, Game, Round, Move, MoveType, TurnState, RoundState } from './lib/state';
import assert from 'assert';

import logger from './lib/logger';

config();

const app: Application = express();
const server = new Server(app);
const io = new IOServer(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

const PORT = Number(process.env.PORT) || 3000;

const game = new Game();
let round: Round | null;
let waitingForWinner = false;

/**
 * Socket IO Events
 */
const EVENT_TYPES = {
	REGISTER: 'register',
	START: 'start',
	ACTION: 'action',
	TURN_TAKEN: 'turn_taken',
	UPDATE_PLAYERS: 'update_players',
	SET_WINNER: 'set_winner',
};

/**
 * Socket IO Handler
 */
io.on('connection', (socket: Socket) => {
	// register event
	socket.on(EVENT_TYPES.REGISTER, (name: string, chips: number, callback: Function) => {
		registerPlayer(name, chips, socket, callback);
	});

	// start game event
	socket.on(EVENT_TYPES.START, () => startGame());

	// action event
	socket.on(EVENT_TYPES.ACTION, (action: string, amount: number) =>
		performAction(action, amount, socket)
	);

	socket.on(EVENT_TYPES.SET_WINNER, (winnerid) => set_winner(winnerid));

	// remove player on disconnect
	socket.on('disconnect', () =>
		removePlayer(socket.id)
	);
});

/**
 * Register the player into the game
 */
const registerPlayer = (name: string, chips: number, socket: Socket, callback: Function) => {
	// if (round) {
	//   logger.error('Player tried to join a game that was already in progress');
	//   return;
	// }

	logger.info(`Player ${name} registered with ${chips} chips`);
	const player = new Player(socket.id, name, chips);
	game.addPlayer(player);

	io.emit(EVENT_TYPES.UPDATE_PLAYERS, game.players);
	callback();
};

/**
 * Remove a player from the game
 */
const removePlayer = (playerId: string) => {
	const player = game.getPlayerById(playerId);

	if (!player) {
		logger.error('Tried to remove a player that does not exist');
	}

	logger.info(`Player ${player?.name || ''} has left the lobby`);
	game.removePlayerById(playerId);
}

/**
 * Initiate the game
 */
const startGame = () => {
	logger.info(`The game has now started at ${Date.now()}`);
	round = game.nextRound();

	io.emit(EVENT_TYPES.START, round);
};

/**
 * Player to perform an action
 */
const performAction = (action: string, amount: number, socket: Socket) => {
	if (!round) {
		logger.error('Player tried to perform an action before the round begun');
		return;
	}

	if (waitingForWinner) {
		logger.error("Waiting for winner to be decided")
		return;
	}

	const player = game.getPlayerById(socket.id);

	if (!player) {
		logger.error('Someone tried to perform an action before registering');
		return;
	}

	if (round.currentPlayer() != player) {
		logger.error('Player tried to perform an action when it was not their turn');
		return;
	}

	logger.info(`Player ${player.name} performed action ${action}`);

	let move: Move;
	switch (action) {
		case 'fold':
			move = new Move(MoveType.Fold);
			break;
		case 'call':
			move = new Move(MoveType.Call);
			break;
		case 'raise':
			move = new Move(MoveType.Raise, amount);
			break;
		default:
			logger.error('Player has performed an invalid action');
			return;
	}

	const turnState = round.playMove(move);

	if (turnState == TurnState.End) {
		// Calculate winners
		let nextRound = round.genNextTurn()
		waitingForWinner = !!nextRound;
		round = nextRound ?? round;
	}

	io.emit(EVENT_TYPES.TURN_TAKEN, { round, turnState, move });
};

const set_winner = (id: string) => {
	if (!waitingForWinner) return;

	let player = game.getPlayerById(id)
	assert(player);
	assert(round?.state == RoundState.Showdown)
	player.chips += round?.currentPot ?? 0;
	io.emit(EVENT_TYPES.START)
}



/**
 * Start the IO server
 */
io.listen(PORT);
