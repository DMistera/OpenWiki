import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article, Wiki } from '@app/models';
import {map} from 'rxjs/operators';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }),
  observe: 'response' as const
};


@Injectable({
  providedIn: 'root'
})
export class DataService{
  constructor(private http: HttpClient) { }

// ==================================================================================================
  fetchWikis(userId?: number){
    if(userId != undefined){
      return this.http.get<any>(`/api/Wiki?ownerID=${userId}`, HTTP_OPTIONS).pipe(map(data => {
        console.log("fetchWikibyOwner status code:", data.status);
        return data;
      }));
    }
    else{
      return this.http.get<any>(`/api/Wiki/`, HTTP_OPTIONS).pipe(map(data => {
        console.log("fetchAllWiki status code:", data.status);
        return data;
      }));
    }
  }

  fetchWikiById(id: number){
    return this.http.get<any>(`/api/Wiki/${id}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("fetchWiki status code:", data.status);
      return data;
    }));
  }
  
  fetchWikiByUrl(url: string){
    return this.http.get<any>(`/api/Wiki/url/${url}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("fetchWikibyUrl status code:", data.status);
      return data;
    }));
  }

  createWiki(wiki: Wiki){
    return this.http.post<any>(`/api/Wiki`, JSON.stringify(wiki), HTTP_OPTIONS).pipe(map(data => {
      console.log("createWiki status code:", data.status);
      return data;
    }));
  }

  deleteWiki(id: number){
    return this.http.delete<any>(`/api/Wiki/${id}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("deleteWiki status code:", data.status);
      return data;
    }));
  }

  editWiki(wiki: Wiki){
    return this.http.put<any>(`/api/Wiki/${wiki.id}`, JSON.stringify(wiki), HTTP_OPTIONS).pipe(map(data => {
      console.log("updateWiki status code:", data.status);
      return data;
    }));
  }

// ==================================================================================================
  fetchArticles(){
    return this.http.get<any>(`/api/Article/`, HTTP_OPTIONS).pipe(map(data => {
      console.log("fetchAllArticles status code:", data.status);
      return data;
    }));
  }

  fetchArticlesByWikiId(wikiId: number){
    return this.http.get<any>(`/api/Article?wikiID=${wikiId}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("fetchArticlesbyWiki status code:", data.status);
      return data;
    }));
  }

  fetchArticlesByUserId(userId: number){
    return this.http.get<any>(`/api/Article?userID=${userId}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("fetchArticlesbyUser status code:", data.status);
      return data;
    }));
  }

  fetchArticleById(id: number){
    return this.http.get<any>(`/api/Article/${id}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("fetchArticle status code:", data.status);
      return data;
    }));
  }

  fetchArticleByUrl(url: string){
    return this.http.get<any>(`/api/Article?url=${url}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("fetchArticlebyUrl status code:", data.status);
      return data;
    }));
  }

  createArticle(article: Article){
    console.log(JSON.stringify(article));
    return this.http.post<any>(`/api/Article`, JSON.stringify(article), HTTP_OPTIONS).pipe(map(data => {
      console.log("createArticle status code:", data.status);
      return data;
    }));
  }

  deleteArticle(id: number){
    return this.http.delete<any>(`/api/Article/${id}`, HTTP_OPTIONS).pipe(map(data => {
      console.log("deleteArticle status code:", data.status);
      return data;
    }));
  }

  editArticle(article: Article){
    return this.http.put<any>(`/api/Article/${article.id}`, JSON.stringify(article), HTTP_OPTIONS).pipe(map(data => {
      console.log("updateArticle status code:", data.status);
      return data;
    }));
  }
// ==================================================================================================

}
