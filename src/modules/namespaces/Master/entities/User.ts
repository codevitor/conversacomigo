import { Entity } from "@core/shared/Entity";
import { Socket } from "socket.io";

interface IUserProps {
  uf: string;
  id: string;
  gender: string;
  room?: string;
  socket?: Socket;
}


export class User extends Entity<IUserProps> {
  get uf(): string { return this.props.uf; }
  get id(): string { return this.props.id; }
  get gender(): string { return this.props.gender; }
  get room(): string { return this.props.room; }
  get socket(): Socket { return this.props.socket; }

  set setUserUF(value: string) { this.props.uf = value; }
  set setUserGender(value: string) { this.props.gender = value; }
  set setUserSocket(value: Socket) { this.props.socket = value; }


  public setUserRoom(value: string) { 
    if (this.props.socket) {
      this.props.socket.join(value)
      this.props.room = value;
    }
  }


  private constructor (props: IUserProps, id?: string) {
    super(props, id);
  }

  static create(props: IUserProps, id?: string): User {
    const room = new User(props, id);
    return room;
  }
}