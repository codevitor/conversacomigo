import { Namespace, Server, Socket } from "socket.io";
import logsole from "src/vendor/logsole";
import * as DTOS from "@core/dtos/WebSocket"
import { Room } from "@modules/namespaces/Master/entities/Room";
import { v4 } from "uuid";
import { User } from "@modules/namespaces/Master/entities/User";
import { UserMapper } from "./mappers/UserMapper";

export default class Master {
  io: Namespace;
  namespace: string = "/master";
  users: User[] = [];
  rooms: Room[] = [];

  constructor (io: Server) {
    this.io = io.of(this.namespace);

    this.io.on("connection", (socket) => {
      this.signIn(socket);

      socket.on("onClientSendMessage", (message: string) => {
        this.onMessage(socket.id, message);
      });

      socket.on("disconnect", (reason: string) => {
        this.signOut(socket.id, reason);
      });
    });
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
      socket: socket,
    }, socket.id);


    this.users.push(user);
    logsole.debug("A new user has signed up " + socket.id);

    setInterval(() => this.masterHeartbeat( ), 100);
  }

  
  /* 
    @signOut like above is used to manage on user has disconnected from the server. 
    Nothing else is so simple. :p
  */
  private signOut (id: string, reason: string) {
    const index = this.users.findIndex(user => user.id === id);

    if (index !== -1) {
      const user = this.users[index];
      
      if (user.room) {
        this.requestCloseRoom(user.room);
      }


      this.users.splice(index, 1);
      logsole.info("User " + id + " has signed out, reason: " + reason);
    } else {
      logsole.error("User " + id + " had problems signing out");
    }
  }


  /*
    @masterHeartbeat is a loop to make new users match line every 15000ms.
  */
  private masterHeartbeat () {
    for (let i = 0; i < this.users.length; i++) {
      for (let j = i + 1; j < this.users.length; j++) {
        const host = this.users[i];
        const visitor = this.users[j];
  
        if (host.uf === visitor.uf && host.gender === visitor.gender && !visitor.room && !host.room) {
          const room = Room.create({
            users: [host, visitor],
          }, v4());



          
          // Preventing the same users from meeting each other in the future. and setting room to correct user.
          room.users.map(user => {
            user.setUserRoom(room.id);
            user.setUserRoom(room.id);

            const lastChatter = room.users.find(u => u.id !== user.id).id
            user.setLastChatter = lastChatter
          })


          this.rooms.push(room);
          this.io.to(room.id).emit("onServerNotifyCreate", room.users.map(user => UserMapper.toPersistence(user)));
        }
      }
    }
  
    return null;
  }


  private requestCloseRoom (id: string) {
    const room = this.rooms.find(room => room.id === id);
   
    if (room) {
      const index = this.rooms.indexOf(room);
      room.users.map(user => {
        user.leaveRoom();
      })
      
      this.rooms.splice(index, 1);

      logsole.debug("Room " + id + " is closed");

      this.io.to(id).emit("onServerRoomClose")
    } else {
      logsole.error("Problems deleting room id: " + id);
    }
  }


  private onMessage(userId: string, message: string) {
    const room = this.rooms.find(room => room.users[0].id == userId || room.users[1].id == userId);
    
    if (room) {
      const messageOrErr = room.addMessage(userId, message);

      if (messageOrErr) {
        this.io.to(room.id).emit("onRoomReceiveMessage", messageOrErr);
      }
    }
  }


  // private onFindNewRoom(userId: string, lastRoomId: string) {
  //   const user = this.users.find(user => user.id == userId);

  //   if (!user) {
  //     return logsole.error("Cannot find user: " + userId)
  //   }
    
  //   const room = this.rooms.find(room => room.id === lastRoomId);

  //   if (room) {
  //     this.requestCloseRoom(room.id);
  //   }
  // }
}