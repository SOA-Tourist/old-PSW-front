import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Checkpoint } from './model/checkpoint.model';

@Injectable({
  providedIn: 'root'
})
export class CheckpointService {

  constructor(private http: HttpClient) { }


  addCheckpoint(checkpoint : Checkpoint): Observable<void> {
    return this.http.post<void>('https://localhost:44333/api/tour/addCheckpoint/', checkpoint);
  }

  getCheckpoints(id : number) : Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>('https://localhost:44333/api/tour/getCheckpoints/' + id);
  }

  getAllToursCheckpoints(tourId: string, page: number, pageSize: number): Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>> (`https://localhost:44333/api/tour/toursCheckpoints?tourId=${tourId}&page=${page}&pageSize=${pageSize}`);
  }

  getCompositeTourCheckpoints(compositeTourId : number) : Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>('https://localhost:44333/api/compositetour/getCheckpoints/' + compositeTourId);
  }

  editCheckpoint(checkpoint: Checkpoint) : Observable<Checkpoint> {
    return this.http.put<Checkpoint>('https://localhost:44333/api/tour/updateCheckpoint', checkpoint);
  }

  deleteCheckpoint(id: number) : Observable<void> {
    return this.http.delete<void>('https://localhost:44333/api/tour/deleteCheckpoint/' + id);
  }

}