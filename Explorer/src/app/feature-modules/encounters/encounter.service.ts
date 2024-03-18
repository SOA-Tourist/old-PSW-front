import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Encounter, EncounterStatistics } from './model/encounters.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { TextWrapper } from 'src/app/shared/model/text-wrapper.model';

@Injectable({
  providedIn: 'root',
})
export class EncounterService {
  constructor(private http: HttpClient) {}

  //Preveo
  getAllEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(
      environment.apiHost + 'administration/encounter'
    );
  }

  getForCheckpoint(id: number): Observable<Encounter> {
    return this.http.get<Encounter>(
      environment.apiHost + `administration/encounter/checkpoint/${id}`
    );
  }

  getAllForCheckpoint(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(
      environment.apiHost + `administration/encounter/checkpoint/`
    );
  }

  getStatisticsForEncounter(
    encounterId: number
  ): Observable<EncounterStatistics> {
    return this.http.get<EncounterStatistics>(
      environment.apiHost + `administration/encounter/statistics/${encounterId}`
    );
  }

  //Preveo
  getActiveEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(
      environment.apiHost + 'tourist/execution/encounter/allEncounters'
    );
  }

  //Preveo
  deleteEncounter(id: number): Observable<Encounter> {
    return this.http.delete<Encounter>(
      environment.apiHost + 'administration/encounter/' + id
    );
  }

  //Preveo
  addEncounter(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(
      environment.apiHost + 'administration/encounter',
      encounter
    );
  }

  //Preveo
  updateEncounter(encounter: Encounter): Observable<Encounter> {
    return this.http.put<Encounter>(
      environment.apiHost + 'administration/encounter',
      encounter
    );
  }
}
