import { Server } from 'socket.io';

export const socketHandler = (io: Server) => {
    // io.on('connection', (socket: Socket) => {
    // socket.on('register', (user: User) => {
    //   users[socket.id] = user;
    // });
  
    // socket.on('action', (action: string, amount: number = 0) => {
    //   switch (action) {
    //     case 'fold':
    //       users[socket.id].status = STATUS.folded;
    //       break;
    //     case 'call':
    //       users[socket.id].status = STATUS.playing;
    //       break;
    //     case 'raise':
    //       users[socket.id].status = STATUS.playing;
    //       pot += amount;
    //       break;
    //   }
    //   io.emit('pot_updated', pot);
    //   io.emit('user_updated', users[socket.id]);
    // });
  //});
}