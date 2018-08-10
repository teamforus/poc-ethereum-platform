import { Component, OnInit } from '@angular/core';
import { Account } from '@models/account';
import { AppRequest, AppMessage } from '@utils/app.service';
import { VaultService } from '@utils/vault.service';
import { ToastService } from '@utils/toast.service';
import { QrService } from '@utils/qr.service';
import { ToastWarningLevels } from '@models/toast';

@Component({
  selector: 'control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  private _showMenu: boolean = false;
  private readonly _accountSelector = 'account-selector';
  private _logoutTimes = 4;

  constructor(
    private qrService: QrService,
    private toastService: ToastService,
    private vaultService: VaultService
  ) {}

  private addAccount() {
    this.qrService.requestFromApp(
      new AppRequest('login'
    ), (message: AppMessage) => {
      const address = message.body.address;
      const name = message.body.name;
      const account = new Account(address, name);
      const isReplaced = this.vaultService.addAccount(account);
      this.vaultService.saveAccounts();
      this.qrService.close();
      if (!isReplaced) {
        this.toastService.toast('Account "' + name + '" is toegevoegd!');
      } else {
        this.toastService.toast(name + ' is aangepast', ToastWarningLevels.ORANGE);
      }
    });
  }

  isCurrentAddress(address:string):boolean {
    return this.vaultService.isCurrent(address);
  }

  async ngOnInit() {
  }

  private logout() {
    this._logoutTimes--;
    if (this._logoutTimes > 0) {
      this.toastService.toast('Klik nog ' + this._logoutTimes  + ' keer om uit te loggen', ToastWarningLevels.WARNING);
    } else {
      this.toastService.toast('Je bent nu uitgelogd', ToastWarningLevels.RED);
      this.vaultService.reset();
    }
  }

  private selectAccount(event) {
    let target = event.target;
    if (target.className !== this._accountSelector) {
      target = target.querySelector('.' + this._accountSelector);
    }
    if (!!target && target.className === this._accountSelector && target.className !== 'current') {
      const account = this.vaultService.getAccountByAddress(target.dataset['address']);
      if (!!account) {
        this.vaultService.currentAccount = account;
        this.vaultService.saveCurrentAccount();
        this.toastService.toast(account.name + ' geselecteerd.');
      }
    }
  }
}