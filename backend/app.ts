import { config } from 'dotenv';
import express, { Application } from 'express';
import { Server } from 'http';
import { Server as IOServer } from 'socket.io';
import { socketHandler } from './lib/socket';

config();

const app: Application = express();
const server = new Server(app);
const io = new IOServer(server);

const PORT = process.env.PORT || 3000;

socketHandler(io);

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
