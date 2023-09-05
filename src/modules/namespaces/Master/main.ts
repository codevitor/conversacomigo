import { Namespace, Server } from "socket.io";
import logsole from "src/vendor/logsole";

export default class Master {
  io: Namespace;
  namespace: string = "/master";

  constructor (io: Server) {
    this.io = io.of(this.namespace);

    this.io.on("connection", () => {
      logsole.debug("New Connection")
    })
  }
}