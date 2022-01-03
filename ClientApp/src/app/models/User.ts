import { Wiki } from "./Wiki";
export class User {
  id: number;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  ownedWikis: Wiki[];
  maintainedWikis: Wiki[];

  constructor(object: any) {
    this.id = object?.id || 0;
    this.userName = object?.userName || '';
    this.email = object?.email || '';
    this.emailConfirmed = object?.emailConfirmed||true;

    this.ownedWikis = [];
    object?.ownedWikis?.forEach((obj:string) => { this.ownedWikis.push(new Wiki(obj)); })||[];

    this.maintainedWikis = [];
    object?.maintainedWikis?.forEach((obj:string) => { this.maintainedWikis.push(new Wiki(obj)); })||[];
  }
}
