import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VaultService } from '@utils/vault.service';
import { Web3Service } from '@utils/web3.service';
import { Token } from '@models/token';
import { QrService } from '@utils/qr.service';
import { AppRequest, AppMessage } from '@utils/app.service';
import { ToastService } from '@utils/toast.service';
import { ActivatedRoute } from '@angular/router';
import { ToastWarningLevels } from '@models/toast';

@Component({
  selector: 'app-edit-token',
  templateUrl: './edit-token.component.html',
  styleUrls: ['./edit-token.component.scss']
})
export class EditTokenComponent implements OnInit {
  private _token: Token;

  constructor(
    private _qrService: QrService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastService: ToastService,
    private _vaultService: VaultService,
    private _web3Service: Web3Service
  ) { }

  private async enable() {
    if (!!this._token) {
      const transaction = await this._web3Service.prepareEnableToken(this._token);
      if (transaction) {
        this._qrService.requestFromApp(new AppRequest('transaction', transaction), (message: AppMessage) => {
          if (message.body.success === true) {
            this._toastService.toast('Voucher wordt nu geactiveerd');
            this._qrService.close();
            this._router.navigateByUrl('/vouchers');
          }
        });
      } else {
        this._toastService.toast('Kan voucher niet activeren', ToastWarningLevels.ERROR);
      }
    }
  }

  async ngOnInit() {
    this._route.params.subscribe(params => {
      const address = params['address'];
      if (address) {
        this._web3Service.getTokenByAddress(address).then((token) => {
          if (token.owner.toLowerCase() !== this._vaultService.currentAddress) {
            this._toastService.toast('U bent niet de eigenaar van deze voucher!', ToastWarningLevels.ERROR);
            this._router.navigateByUrl('/vouchers');
          } else {
            this._token = token;
          }
        });
      }
    });
  }

}
