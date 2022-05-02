import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IdentityVaultService } from './identity-vault.service';

const appInitFactory = ( vaultService: IdentityVaultService): (() => Promise<void>) => () => vaultService.init();

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {
    provide: APP_INITIALIZER,
    useFactory: appInitFactory,
    deps: [IdentityVaultService],
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
