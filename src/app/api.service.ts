import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) 
  {

  }
  getUsers()
  {
    return this.http.get("./assets/users.json");
  }
  getRestaurants()
  {
    return this.http.get("./assets/restaurants.json");
  }
  getCities()
  {
    return this.http.get("./assets/virudhunagar.json");
  }
}
