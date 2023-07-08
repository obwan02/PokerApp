import { config } from 'dotenv';
import express, { Application } from 'express';
import { Server } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

config();

const app: Application = express();
const server = new Server(app);
const io = new IOServer(server);

const PORT = process.env.PORT || 3000;

const game = new Game();
let round: Round;

io.on('connection', (socket: Socket) => {

	socket.on('register', (name: string, chips: number) => {
	  const player = new Player(socket.id, name, chips);
	  game.addPlayer(player);
	});

	socket.on('start', () => {
		round = game.startRound();
		io.emit('started');
	});
  
	socket.on('action', (action: string, amount: number = 0) => {
		const player = game.getPlayerById(socket.id);

		if (!player) {
			throw new Error('Player could not be found');
		}

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
	  }

	  const pot = round.currentPot;

	  io.emit('pot_updated', pot);
	  io.emit('user_updated', player);
	});
  });
  

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
