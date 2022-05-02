import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';
import { Subject } from 'rxjs';
import { IdentityVaultService } from './identity-vault.service';
import { MessageService } from './message.service';

type StorageData = string | number | boolean;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private ready$ = new Subject<void>();

  constructor(private storage: Storage, private identityVaultService: IdentityVaultService,
    private message: MessageService) {
    void this.init();
  }

  async init() {
    this.message.log('[Storage] Defining Driver:' + IonicSecureStorageDriver);
    await this.storage.defineDriver(IonicSecureStorageDriver);
    this.message.log('[Storage] Creating Storage...');
    await this.storage.create();
    this.message.log('[Storage] Storage created.');

    this.message.log('[Storage] Getting Vault Encryption Key...');
    try {
      let encryptionKey = await this.identityVaultService.getEncryptionKey();
      if (!encryptionKey) {
        this.message.log('[Storage] Encryption key not found. Generating new key...');
        encryptionKey = await this.identityVaultService.generateEncryptionKey();
      }
      this.message.log('[Storage] Encryption Key: '+ encryptionKey);

      this.message.log('[Storage] Setting encryption key...');
      this.storage.setEncryptionKey(encryptionKey);
      this.message.log('[Storage] Storage Init complete.');
      this.ready$.complete();

    } catch (error) {
      console.log('[Storage] ERROR', error);
    }
  }

  async isReady(): Promise<void> {
    return this.ready$.toPromise();
  }

  async get(key: string): Promise<StorageData> {
    try {
      this.message.log('[Storage] Waiting storage to be ready...');
      await this.isReady();
      this.message.log('[Storage] Retrieving value of key:'+ key);
      const x = await this.storage.get(key);
      this.message.log('[Storage] Got value: '+ x);
      return x;
    } catch (error) {
      console.error(`Storage Service Error in get() with key ${key}:`, error);
      throw error;
    }
  }

  async store(key: string, value: string): Promise<boolean> {
    try {
      console.log(`[Storage] store ${key} = ${value}`);
      await this.isReady();
      await this.storage.set(key, value);
      console.log(`[Storage] store ${key} done`);
      return true;
    } catch (error) {
      console.log('Storage error with key ' + key, error);
      throw error;
    }
  }
}
