import { config } from 'dotenv';
import { Server } from 'http';
import express, { Application } from 'express';
import { Server as IOServer, Socket } from 'socket.io';
import { Player, Game, Round, Move, MoveType, TurnState } from './lib/state';

import logger from './lib/logger';

config();

const app: Application = express();
const server = new Server(app);
const io = new IOServer(server);

const PORT = Number(process.env.PORT) || 3000;

const game = new Game();
let round: Round | null;

/**
 * Socket IO Events
 */
const EVENT_TYPES = {
  REGISTER: 'register',
  START: 'start',
  ACTION: 'action',
  TURN_TAKEN: 'turn_taken',
  NEW_PLAYER: 'new_player'
}

/**
 * Socket IO Handler
 */
io.on('connection', (socket: Socket) => {
  // register event
  socket.on(EVENT_TYPES.REGISTER, (name: string, chips: number) => registerPlayer(name, chips, socket));

  // start game event
  socket.on(EVENT_TYPES.START, () => startGame());

  // action event
  socket.on(EVENT_TYPES.ACTION, (action: string, amount: number) => performAction(action, amount, socket));
});

/**
 * Register the player into the game
 */
const registerPlayer = (name: string, chips: number, socket: Socket) => {
  logger.info(`Player ${name} registered with ${chips} chips`);
  const player = new Player(socket.id, name, chips);
  game.addPlayer(player);

  io.emit(EVENT_TYPES.NEW_PLAYER, player);
}

/**
 * Initiate the game
 */
const startGame = () => {
  logger.info(`The game has now started at ${Date.now()}`)
  round = game.nextRound();

  io.emit(EVENT_TYPES.START, { round });
}

/**
 * Player to perform an action
 */
const performAction = (action: string, amount: number, socket: Socket) => {
  if (!round) {
    logger.error('Player tried to perform an action before the round begun');
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

  let turnTaken: TurnState;

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

  io.emit('turn_taken', { round, turnTaken });
}

/**
 * Start the IO server
 */
io.listen(PORT);
