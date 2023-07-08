import { config } from 'dotenv';
import { Server } from 'http';
import express, { Application } from 'express';
import { Server as IOServer, Socket } from 'socket.io';
import { Player, Game, Round, Move, MoveType, TurnState } from './lib/state';

import logger from './lib/logger';
import assert from 'assert';

config();

const app: Application = express();
const server = new Server(app);
const io = new IOServer(server);

const PORT = process.env.PORT || 3000;

const game = new Game();
let round: Round | null | undefined;

io.on('connection', (socket: Socket) => {

	/**
	 * Register player into game
	 */
	socket.on('register', (name: string, chips: number) => {
		logger.info(`Player ${name} registered with ${chips} chips`);
		const player = new Player(socket.id, name, chips);
		game.addPlayer(player);
	});

	/**
	 * Start the game
	 */
	socket.on('start', () => {
		logger.info(`The game has now started at ${Date.now()}`)
		round = game.nextRound();
		io.emit('new_round', { round });
	});

	/**
	 * Player to perform action
	 */
	socket.on('action', (action: string, amount?: number) => {
		assert(round);

		const player = game.getPlayerById(socket.id);
		assert(player);

		logger.info(`Player ${player.name} performed action ${action}`);

		let turnTaken;

		switch (action) {
			case 'fold':
				turnTaken = round.playMove(new Move(MoveType.Fold));
				break;
			case 'call':
				turnTaken = round.playMove(new Move(MoveType.Call));
				break;
			case 'raise':
				turnTaken = round.playMove(new Move(MoveType.Raise, amount));
				break;
			default:
				logger.error('Player has performed an invalid action');
				return;
		}

		const pot = round.currentPot;

		io.emit('pot_updated', pot);
		io.emit('user_updated', player);
		io.emit('turn_taken', { round, turnTaken });
	});
});

/**
 * Start the web server
 */
app.listen(PORT, () => {
	logger.info(`Server is listening on port ${PORT}`);
});
