import { User } from "./User";

export class Wiki {
  id: number;
  url: string;
  name: string;
  description: string;
  owner: User;
  maintainers: User[];

  constructor(object: any) {
    this.id = object?.id || 0;
    this.url = object?.url || '';
    this.name = object?.name || '';
    this.description = object?.description || '';
    this.owner = new User(object?.owner)|| {};

    this.maintainers = [];
    object?.maintainers?.forEach((obj:string) => { this.maintainers.push(new User(obj)); })||[];
  }
}
