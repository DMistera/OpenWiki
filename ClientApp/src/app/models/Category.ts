export class Category {
    id: number;
    name: string;
    description: string;
    creationDate: string;
    modificationDate: string;
  
  
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
    }
}