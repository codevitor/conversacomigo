export type UserDTO = {
  uf: string;
  id: string;
  gender: string;
  room?: number;
}

export type HandshakeDTO = {
 query: {
  uf: string;
  gender: string;
 }
}


export type RoomMessages = {
  user: string;
  message: string;
  date: string;
}