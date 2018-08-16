import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { VoucherListComponent } from '@app/vouchers/list/voucher-list.component';

import { VaultService } from '@utils/vault.service';
import { Web3Service } from '@utils/web3.service';
import { QrViewComponent } from '@app/helper-components/qr-view.component';
import { ControlPanelComponent } from '@app/control-panel/control-panel.component';
import { ToastService } from '@utils/toast.service';
import { ToastComponent } from '@app/helper-components/toast.component';
import { QrService } from '@utils/qr.service';
import { AppService } from '@utils/app.service';
import { CreateTokenComponent } from '@app/create-token/create-token.component';
import { RequestComponent } from '@app/request/request.component';
import { RequireLoginComponent } from '@app/require-account/require-login.component';
import { EventService } from '@utils/event.service';
import { ViewTokenComponent } from '@app/view-token/view-token.component';


@NgModule({
  declarations: [
    AppComponent,
    ControlPanelComponent,
    CreateTokenComponent,
    QrViewComponent,
    RequestComponent,
    RequireLoginComponent,
    ToastComponent,
    ViewTokenComponent,
    VoucherListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    QRCodeModule
  ],
  providers: [AppService, EventService, QrService, ToastService, VaultService, Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
