import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MapService {
  constructor(private http: HttpClient) {}

  private defaultURL = "http://api.open-notify.org/iss-now.json";

  public getIssLocation(path: string = this.defaultURL): Observable<any> {
    return this.http.get(path, { headers: { "Content-Type": "text/plain" }, responseType: "json" });
  }
}
