import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as Namespaces from "@modules/namespaces"
import logsole from "src/vendor/logsole";

class App {
  public app: express.Application;
  public io: Server;
  public server: any;

  constructor () {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.middlewares();
    this.namespaces();
  }

  private middlewares () {
    this.app.use(cors({
      exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length'],
    }));

    this.app.use(express.urlencoded({extended: false}));
    this.app.use(express.json({ type: ['application/json', 'text/plain'] }));

    logsole.info("Middlewares ok");
  }

  private namespaces() {
    Object.values(Namespaces).map(namespace => {
      new namespace(this.io);
      logsole.info(namespace.name +" namespace initialized");
    });
  }
}



export default new App().server;