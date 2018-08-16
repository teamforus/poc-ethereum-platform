import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VaultService } from '@utils/vault.service';
import { Web3Service } from '@utils/web3.service';
import { Token } from '@models/token';
import { QrService } from '@utils/qr.service';
import { AppRequest, AppMessage, AppService } from '@utils/app.service';
import { ToastService } from '@utils/toast.service';
import { ToastWarningLevels } from '@models/toast';

@Component({
  selector: 'app-view-token',
  templateUrl: './view-token.component.html',
  styleUrls: ['./view-token.component.scss']
})
export class ViewTokenComponent {
  private _providerAddress: string = '';
  private _providerAddressError: boolean = false;
  private _token: Token = null

  constructor(
    private _appService: AppService,
    private _qrService: QrService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastService: ToastService,
    private _vaultService: VaultService,
    private _web3Service: Web3Service
  ) {
    this._route.params.subscribe(async (params) => {
      const address = params['address'];
      if (!!address) {
        this._token = await this._web3Service.getTokenByAddress(address);
      } else {
        this._router.navigateByUrl('/');
      }
    })
  }

  private async addProvider() {
    this._providerAddressError = !this._web3Service.isValidAddress(this._providerAddress);
    if (!this._providerAddressError) {
      const transaction = await this._web3Service.prepareAddProvider(this._token, this._providerAddress);
      const gas = await this._web3Service.getGasEstimate(transaction);
      console.log(gas);
      if (!!transaction) {
        this._qrService.requestFromApp(new AppRequest('transaction', transaction), (message: AppMessage) => {
          console.log(message.body);
        })
      }
    }

  }

  private async becomeProvider() {
    const transaction = this._web3Service.prepareApplyForProvider(this._token);
    if (!!transaction) {
    }
  }

  private async enable() {
    const transaction = await this._web3Service.prepareEnableToken(this._token);
    if (transaction) {
      this._qrService.requestFromApp(new AppRequest('transaction', transaction), (message: AppMessage) => {
        if (message.body.success === true) {
          this._toastService.toast('Voucher wordt nu geactiveerd');
          this._qrService.close();
        }
      });
    } else {
      this._toastService.toast('Kan voucher niet activeren', ToastWarningLevels.ERROR);
    }

  }

}
