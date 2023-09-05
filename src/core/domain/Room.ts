import { RoomMessages, UserDTO } from "@core/dtos/WebSocket";
import { Entity } from "@core/shared/Entity";


interface IRoomProps {
  users: UserDTO[];
  messages?: RoomMessages[];
  pass?: string;
}

export class Room extends Entity<IRoomProps> {
  get users(): UserDTO[] {
    return this.props.users;
  }

  get messages(): RoomMessages[] {
    return this.props.messages;
  }

  set setRoomPassword(pass: string) {
    this.props.pass = pass;
  }

  public addMessage(message: RoomMessages) {
    this.props.messages.push(message)
  }

  public pushUser (user: UserDTO): void {
    this.props.users.push(user);
  }

  public removeUser(id: string): void {
    const index = this.props.users.findIndex((user: { id: string; }) => user.id === id);

    if (index !== -1) {
      this.props.users.splice(index, 1);
    }
  }

  private constructor (props: IRoomProps, id?: string) {
    super(props, id);
  }

  static create(props: IRoomProps, id?: string): Room {
    const room = new Room(props, id);
    return room;
  }
}