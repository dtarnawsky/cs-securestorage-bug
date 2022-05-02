import { Injectable } from '@angular/core';
import { BrowserVault, DeviceSecurityType, IdentityVaultConfig, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';

const config: IdentityVaultConfig = {
  key: 'com.ionic.bio',
  type: VaultType.DeviceSecurity,
  deviceSecurityType: DeviceSecurityType.Biometrics,
  androidBiometricsPromptTitle: 'Sign On'
};

const configKey: IdentityVaultConfig = {
  key: 'com.ionic.ss',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  androidBiometricsPromptTitle: 'Sign On'
};

@Injectable({ providedIn: 'root' })
export class IdentityVaultService {
  public deviceBiometric = new BehaviorSubject<string>(null);
  private readonly encryptionKey = 'encryption-key';
  private vault: Vault | BrowserVault;
  private encryptionVault: Vault | BrowserVault;

  constructor(private platform: Platform, private message: MessageService) { }

  async init(): Promise<void> {
    this.message.log('[IV] await platform ready.');
    await this.platform.ready();
    this.message.log('[IV] after platform ready.');
    const platform = this.platform.is('cordova');
    this.vault = platform ? new Vault(config) : new BrowserVault(config);
    this.message.log('[IV] vault created.');
    this.encryptionVault = platform ? new Vault(configKey) : new BrowserVault(configKey);
    this.message.log('[IV] encryptionVault created.');
  }

  async getEncryptionKey(): Promise<string> {
    return await this.encryptionVault.getValue(this.encryptionKey);
  }

  async generateEncryptionKey(): Promise<string> {
    const r = (Math.random() + 1).toString(36).substring(7);
    await this.encryptionVault.setValue(this.encryptionKey, r);
    return r;
  }
}
