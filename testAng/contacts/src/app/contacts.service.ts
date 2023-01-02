import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from './Contact';
import { Observable } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = "http://localhost:5103/contacts";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl)
  }

  deleteContact(id: number): any {
    return this.http.delete<Contact>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  saveUpdatedContact(id: number, contact: Contact): any {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact, this.httpOptions);
  }

  addNewContact(contact: Contact): any {
    return this.http.post<Contact>(`${this.apiUrl}`, contact, this.httpOptions);
  }
}
