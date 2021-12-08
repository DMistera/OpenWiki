import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Wiki } from '@app/models';
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
export class DataService {
  constructor(private http: HttpClient) { }


  fetchWiki(id?: any, url?: string, userId?: number){
    if(id != null){
      return this.http.get<any>(`/api/Wiki/${id}`, HTTP_OPTIONS).pipe(map(data => {
        console.log("fetchWiki status code:", data.status);
        return data;
      }));
    }
    else if(url != null){
      return this.http.get<any>(`/api/Wiki?url=${url}`, HTTP_OPTIONS).pipe(map(data => {
        console.log("fetchWikibyUrl status code:", data.status);
        return data;
      }));
    }
    else if(userId != null){
      return this.http.get<any>(`/api/Wiki?userID=${userId}`, HTTP_OPTIONS).pipe(map(data => {
        console.log("fetchWikibyUser status code:", data.status);
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
}
