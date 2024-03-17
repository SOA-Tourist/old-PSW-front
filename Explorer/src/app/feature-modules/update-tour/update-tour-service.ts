import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tour } from '../tour-authoring/model/tour.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private http: HttpClient) {}

  getTour(id: String): Observable<Tour> {
    return this.http.get<Tour>(`https://localhost:44333/api/singletour/${id}`);
  }
}
