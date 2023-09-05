import { Namespace, Server, Socket } from "socket.io";
import logsole from "src/vendor/logsole";
import * as DTOS from "@core/dtos/WebSocket"
import { Room } from "@core/domain/Room";
import { v4 } from "uuid";
import { User } from "@core/domain/User";

export default class Master {
  io: Namespace;
  namespace: string = "/master";
  users: User[] = [];
  rooms: Room[] = [];

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

    // For now just push user to users array.
    const user = User.create({
      id: socket.id,
      uf: query.uf,
      gender: query.gender,
    }, socket.id);


    this.users.push(user);
    logsole.debug("A new user has signed up " + socket.id);

    setInterval(() => this.masterHeartbeat( ), 10000);
  }

  
  /* 
    @signOut like above is used to manage on user has disconnected from the server. 
    Nothing else is so simple. :p
  */
  private signOut (id: string, reason: string) {
    const index = this.users.findIndex(user => user.id === id);

    if (index !== -1) {
      this.users.splice(index, 1);
      logsole.debug("User " + id + " has signed out, reason: " + reason);
    } else {
      logsole.error("User " + id + " had problems signing out");
    }
  }


  private masterHeartbeat () {
    for (let i = 0; i < this.users.length; i++) {
      for (let j = i + 1; j < this.users.length; j++) {
        const host = this.users[i];
        const visitor = this.users[j];
  
        if (host.uf === visitor.uf && host.gender === visitor.gender && !visitor.room && !host.room) {
          const room = Room.create({
            users: [host, visitor],
          }, v4())
        }
      }
    }
  
    return null;
  } 
}