import { Section } from "./Section";
import { User } from "./User";
import { Wiki } from "./Wiki";

export class Article {
  id: number;
  title: string;
  abstract: string;
  wiki: Wiki;
  wikiID: number;
  sections: Section[];
  creator: User;
  creationDate: string;
  active: boolean


  constructor(object: any) {
    if(object.id != null){
      this.id = object.id;
    }
    this.title = object?.title || '';
    this.abstract = object?.abstract || '';
    this.active = object?.active || false;
    if(object.wiki != null){
      this.wiki = new Wiki(object.wiki);
      this.wikiID = this.wiki.id;
    }
    else if(object.wikiID != null){
      this.wikiID = object?.wikiID;
    }
    if(object.owner != null){
      this.creator = new User(object.owner);
    }
    if(object.creationDate != null){
      this.creationDate = object.creationDate
    }
    this.sections = [];
    object?.sections?.forEach((obj:string) => { this.sections.push(new Section(obj)); })||[];
  }


}
