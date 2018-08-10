//import { Web3Service } from '@utils/web3/web3.service';
import { VaultService } from '@utils/vault.service';
import { Component, OnInit } from '@angular/core';
import { Token } from '@models/token';
import { Web3Service } from '@utils/web3.service';

@Component({
  selector: 'app-vouchers',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {
  tokens: Token[];

  constructor(
    private vault: VaultService,
    private web3Service: Web3Service
  ) { }

  async ngOnInit() {
    this.tokens = await this.web3Service.getTokens();
  }
  
  private canEdit(token:Token): boolean {
    return  !!this.vault.currentAccount &&
          this.vault.currentAddress.toLowerCase() === token.owner.toLowerCase() && 
          !token.enabled && !token.expired;
  }

  private canRequest(token:Token): boolean {
    return !!this.vault.currentAccount && 
          this.vault.currentAddress.toLowerCase() !== token.owner.toLowerCase() && 
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
