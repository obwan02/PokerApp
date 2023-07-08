import { config } from 'dotenv';
import { Server } from 'http';
import express, { Application } from 'express';
import { Server as IOServer, Socket } from 'socket.io';
import { Player, Game, Round } from './state';

import logger from './lib/logger';

config();

const app: Application = express();
const server = new Server(app);
const io = new IOServer(server);

const PORT = process.env.PORT || 3000;

const game = new Game();
let round: Round;

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
		round = game.startRound();
		io.emit('started');
	});

	/**
	 * Player to perform action
	 */
	socket.on('action', (action: string, amount: number = 0) => {
		const player = game.getPlayerById(socket.id);
		if (!player) {
			throw new Error('Player could not be found');
		}

		logger.info(`Player ${player.name} performed action ${action}`);

		switch (action) {
			case 'fold':
				//player.status = STATUS.folded;
				break;
			case 'call':
				//player.status = STATUS.playing;
				break;
			case 'raise':
				//player.status = STATUS.playing;
				//player.chips -= amount;
				//round.addToPot(amount);
				break;
			default:
				logger.error('Player has performed an invalid action');
				return;
		}

		const pot = round.currentPot;

		io.emit('pot_updated', pot);
		io.emit('user_updated', player);
	});
});

/**
 * Start the web server
 */
app.listen(PORT, () => {
	logger.info(`Server is listening on port ${PORT}`);
});
