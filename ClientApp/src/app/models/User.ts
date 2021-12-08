export class User {
  id: number;
  userName: string;
  email: string;

  constructor(object: any) {
    this.id = object?.id || 0;
    this.userName = object?.userName || '';
    this.email = object?.email || '';
  }
}
