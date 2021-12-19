export class Section {
    id: number;
    title: string;
    content: string;
  
    constructor(object: any) {
      if(object.id != null){
        this.id = object.id;
      }
      this.title = object?.title || '';
      this.content = object?.content || '';
    }
  }
  