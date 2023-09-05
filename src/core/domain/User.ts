import { Entity } from "@core/shared/Entity";

interface IUserProps {
  uf: string;
  id: string;
  gender: string;
  room?: string;
}


export class User extends Entity<IUserProps> {
  get uf(): string { return this.uf; }
  get id(): string { return this.id; }
  get gender(): string { return this.gender; }
  get room(): number { return this.room; }

  set uf(value: string) { this.uf = value; }
  set gender(value: string) { this.gender = value; }
  set room(value: number) { this.room = value; }


  private constructor (props: IUserProps, id?: string) {
    super(props, id);
  }

  static create(props: IUserProps, id?: string): User {
    const room = new User(props, id);
    return room;
  }
}