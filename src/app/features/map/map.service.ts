import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MapService {
  constructor(private http: HttpClient) {}

  // ISS LOCATION
  private readonly defaultURL = "https://api.wheretheiss.at/v1/satellites/25544";

  public getIssLocation(path: string = this.defaultURL): Observable<any> {
    return this.http.get(path);
  }
}
