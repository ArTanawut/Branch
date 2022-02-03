import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  restApiPost(url: string) {
    return this.http.post<any[]>(`${url}`, '');
  }
  restApiGet(url: string) {
    return this.http.get<any[]>(`${url}`);
  }

  restApiSendParmNoAuthorization(url: string, data: any) {
    return this.http.get<any[]>(`${url}`, data);
  }

  restApiSendParm(url: string, data: any) {
    var header = new HttpHeaders();
      header = header.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any[]>(`${url}`, data, { headers: header });
  }

  restApiSendParmHeader(url: string, data: any, header: any) {
    return this.http.post<any[]>(`${url}`, data,header);
  }
  restApi(url: string) {
    var accessToken = localStorage.getItem('accessToken');
    var header = new HttpHeaders();
      header = header.append('Authorization', 'Bearer ' + accessToken);
      header = header.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any[]>(`${url}`, '', { headers: header });
  }

}
