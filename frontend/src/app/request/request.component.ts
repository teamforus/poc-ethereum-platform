import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VaultService } from '@utils/vault.service';
import { Web3Service } from '@utils/web3.service';
import { Token } from '@models/token';
import { QrService } from '@utils/qr.service';
import { AppRequest, AppMessage } from '@utils/app.service';
import { ToastService } from '@utils/toast.service';
import { ToastWarningLevels } from '@models/toast';

@Component({
  selector: 'app-create-token',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  private _token: Token;

  constructor(
    private _qrService: QrService,
    private _route: ActivatedRoute,
    private _routerService: Router,
    private _toastService: ToastService,
    private _vaultService: VaultService,
    private _web3Service: Web3Service
  ) { }

  async ngOnInit() {
    this._route.params.subscribe(params => {
      const address = params['address'];
      if (address) {
        this._web3Service.getTokenByAddress(address).then((token) => {
          this._token = token;
        });
      }
    });
  }

  private async requestVoucher() {
    const transaction = await this._web3Service.prepareRequestToken(this._token);
    if (!!transaction) {
      this._qrService.requestFromApp(new AppRequest('transaction', transaction), (message:AppMessage) => {
        if (!!message.body['success']) {
          this._toastService.toast('De aanvraag is ingedient. U krijgt een melding in uw identiteisapp als de aanvraag is.');
          this._qrService.close();
          this._routerService.navigateByUrl('/vouchers');
        }
      });
    }
  }

  private async submit() {
    const transaction = await this._web3Service.prepareRequestToken(this._token);
    if (transaction) {
      this._qrService.requestFromApp(new AppRequest('transaction', transaction), (message: AppMessage) => {
      });
    } else {
      this._toastService.toast('Aanvraag niet gelukt. Dit kan komen omdat de voucher niet toegang heeft tot alle claims in uw identiteit.', ToastWarningLevels.RED);
    }
  }

}
