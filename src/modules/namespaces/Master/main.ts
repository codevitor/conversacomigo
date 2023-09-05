import { Namespace, Server, Socket } from "socket.io";
import logsole from "src/vendor/logsole";
import * as DTOS from "./dtos/WebSocket"


export default class Master {
  io: Namespace;
  namespace: string = "/master";
  users: DTOS.UserDTO[] = [];

  constructor (io: Server) {
    this.io = io.of(this.namespace);

    this.io.on("connection", (socket) => {
      this.signIn(socket);

      socket.on("disconnect", (reason: string) => {
        this.signOut(socket.id, reason)
      })
    })
  }

  /* 
    @signIn is used to register a new user on master namespace and master namespace is used to manager users
    and channels.
  */
  private signIn (socket: Socket) {
    const { query } = socket.handshake as unknown as DTOS.HandshakeDTO;

    this.users.push({
      id: socket.id,
      uf: query.uf,
      gender: query.gender,
    })
    
    logsole.debug("A new user has signed up " + socket.id)
  }


  private signOut (id: string, reason: string) {
    const index = this.users.findIndex(user => user.id === id);

    if (index !== -1) {
      this.users.splice(index, 1);
      logsole.debug("User " + id + " has signed out, reason: " + reason);
    } else {
      logsole.error("User " + id + " had problems signing out");
    }
  }
}