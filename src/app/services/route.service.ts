import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import IsochroneResponse = Openrouteservice.IsochroneResponse;
import Isochrones = Openrouteservice.Isochrones;
import IsochroneSettings = Openrouteservice.IsochroneSettings;

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor() { }

  getIsochrones(settings: IsochroneSettings): Observable<IsochroneResponse> {
    const isochrones = new Isochrones({
      api_key: environment.apiKey
    });
    const result: Promise<IsochroneResponse> = isochrones.calculate(settings);
    return from(result);
  }
}