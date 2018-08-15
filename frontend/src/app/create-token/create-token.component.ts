import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VaultService } from '@utils/vault.service';
import { Web3Service } from '@utils/web3.service';
import { Token } from '@models/form/create-token';
import { QrService } from '@utils/qr.service';
import { AppRequest, AppMessage } from '@utils/app.service';
import { ToastService } from '@utils/toast.service';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss']
})
export class CreateTokenComponent {
  private _agrees = false;
  private _token = new Token()

  constructor(
    private _qrService: QrService,
    private _router: Router,
    private _toastService: ToastService,
    private _vaultService: VaultService,
    private _web3Service: Web3Service
  ) { }
  
  private async submit() {
    const transaction = await this._web3Service.prepareCreateToken(this._token);
    this._qrService.requestFromApp(new AppRequest('transaction', transaction), (message:AppMessage) => {
      if (message.body.success === true) {
        this._toastService.toast('Token is aangemaakt. Het kan even duren voordat deze verschijnt');
        this._qrService.close();
        this._router.navigateByUrl('/vouchers');
      }
    });
  }

}
