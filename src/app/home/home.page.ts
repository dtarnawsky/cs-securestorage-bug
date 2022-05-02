import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public messages;
  constructor(private storageService: StorageService, private messageService: MessageService) {
    this.messages = messageService.messages;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.storageService.store('stuff', 'value of stuff');
    }, 10000);
  }

}
