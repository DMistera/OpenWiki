import { User } from "./User";
import { Wiki } from "./Wiki";

export class Article {
  id: number;
  title: string;
  abstract: string;
  wiki: Wiki;
  creator: User;
  creationDate: string;


  constructor(object: any) {
    this.id = object?.id || 0;
    this.title = object?.title || '';
    this.abstract = object?.abstract || '';
    this.wiki = new Wiki(object.wiki);
    this.creator = new User(object.owner);
    this.creationDate = object?.creationDate || '';
  }
}
