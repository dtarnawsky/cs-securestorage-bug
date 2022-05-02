import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public messages: Array<string> = [];
  constructor() { }

  log(message: string) {
    console.log(message);
    this.messages.push(message);
  }
}
