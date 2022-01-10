import { User } from "./User";

export class Wiki {
  id: number;
  url: string;
  name: string;
  description: string;
  creationDate: string;
  owner: User;
  maintainers: User[];

  constructor(object: any) {
    this.id = object?.id || 0;
    this.url = object?.url || '';
    this.name = object?.name || '';
    this.description = object?.description || '';
    if(object.owner != null){
      this.owner = new User(object.owner);
    }else{
      this.owner = new User({});
    }
    if(object.creationDate != null){
      this.creationDate = object.creationDate
    }
    this.maintainers = [];
    object?.maintainers?.forEach((obj:string) => { this.maintainers.push(new User(obj)); })||[];
  }
}
