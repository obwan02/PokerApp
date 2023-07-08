declare enum STATUS {
  folded = 'folded',
  playing = 'playing'
}
  
declare interface User {
  name: string;
  balance: number;
  status: STATUS;
}
  