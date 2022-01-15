import { Article, User } from ".";

export class Category {
    id: number;
    name: string;
    description: string;
    creationDate: string;
    modificationDate: string;

    creator: User;
    modifier: User;

    articles: Article[];
  
  
    constructor(object: any) {
      if(object.id != null){
        this.id = object.id;
      }
      this.name = object?.name || '';
      this.description = object?.description || '';
      if(object.creationDate != null){
        this.creationDate = object.creationDate
      }
      if(object.modificationDate != null){
        this.modificationDate = object.modificationDate
      }
      if(object.creator != null){
        this.creator = new User(object.creator);
      }
      if(object.modifier != null){
        this.modifier = new User(object.modifier);
      }

      this.articles = [];
      object?.articles?.forEach((obj:string) => { this.articles.push(new Article(obj)); })||[];
    }
}