//import { Web3Service } from '@utils/web3/web3.service';
import { VaultService } from '@utils/vault.service';
import { Component, OnInit } from '@angular/core';
import { Token } from '@models/token';
import { Web3Service } from '@utils/web3.service';
import { Observable } from 'rxjs';
import { QRCode } from 'qrcode';
import { QrService } from '@utils/qr.service';

@Component({
  selector: 'app-vouchers',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {
  tokens$: Observable<Token[]>;

  constructor(
    private vault: VaultService,
    private qrService: QrService,
    private web3Service: Web3Service
  ) { 
  }

  private getQrCode(token: Token):string {
    const json = {
      address: token.address,
      owner: token.owner,
      name: token.name
    }
    return JSON.stringify(json);
  }

  async ngOnInit() {
    this.tokens$ = this.web3Service.tokens;
  }
  
  private showQr(token:Token) {
    this.qrService.present(this.getQrCode(token));
  }

  private canEdit(token:Token): boolean {
    return  !!this.vault.currentAccount &&
          this.vault.currentAddress.toLowerCase() === token.owner.toLowerCase() && 
          !token.enabled && !token.expired;
  }

  private canRequest(token:Token): boolean {
    return !!this.vault.currentAccount && 
          this.vault.currentAddress.toLowerCase() !== token.owner.toLowerCase() && 
          (!token.hasRequested(this.vault.currentAddress)) &&
          token.enabled && !token.expired;
  }

  getStatusLabel(token: Token): string {
    switch (token.state) {
      case 0: return 'In aanmaak';
      case 1: return 'Actief';
      case 2: return 'Verlopen';
      default: return '???';
    }
  }

}
