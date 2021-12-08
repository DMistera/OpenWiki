import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wiki-edit',
  templateUrl: './wiki-edit.component.html',
  styleUrls: ['./wiki-edit.component.scss']
})
export class WikiEditComponent implements OnInit {
  wikiId: number;
  wikiURL: string;
  wiki: Wiki;
  form: FormGroup;
  wikiUpdated: Wiki;
  isLoadingData: boolean;

  // ======================
  isWikiDataUpdated = false;

  isSuccessful = false;
  isFailed = false;
  errorMessage = '';
  isResetDone = false;
  // ======================

  constructor(private dataService: DataService, private actRoute: ActivatedRoute, private formBuilder: FormBuilder){
    this.wikiURL = this.actRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      url: '',
      description: ''
    });
    this.isLoadingData = true;
    this.dataService.fetchWiki(undefined, this.wikiURL).subscribe((data: any) => {
      console.log(data);
      this.wiki = new Wiki(data.body[0]);//TODO remove [0] after fix
      this.wikiUpdated = new Wiki(data.body[0]);
      this.form = this.formBuilder.group({
        name: this.wiki.name,
        url: this.wiki.url,
        description: this.wiki.description
      });
      this.onChanges();
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.wikiUpdated.name = val.name;
      this.wikiUpdated.url = val.url;
      this.wikiUpdated.description = val.description;
      if(!(JSON.stringify(this.wiki) === JSON.stringify(this.wikiUpdated))){
        this.isWikiDataUpdated = true;
      }
      else{
        this.isWikiDataUpdated = false;
      }
      console.log(this.isWikiDataUpdated);
    });
  }

  updateWikiData(): void{
    if(this.isWikiDataUpdated){
      this.dataService.editWiki(this.wikiUpdated).subscribe(
        data => {
          // console.log(data);
          this.wiki = new Wiki(this.wikiUpdated);
          this.isWikiDataUpdated= false;

          this.isSuccessful = true;
          this.isFailed = false;
          this.resetAfterTimeout();
        },
        err => {
          // TODO error support
          // console.log(err);
          this.isSuccessful = false;
          this.isFailed = true;
          this.resetAfterTimeout();
        }
      );
    }
  }

  resetAfterTimeout(){
    setTimeout( ()=>{
      if(this.isResetDone){
        this.isResetDone = false;
      }
      else{
        this.isWikiDataUpdated= false;
        this.isSuccessful = false;
        this.isFailed = false;
      }
    }, 5000)
  }

  resetForm(){
    this.isWikiDataUpdated= false;
    this.isSuccessful = false;
    this.isFailed = false;
    this.isResetDone = true;
  }
}
