import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@models/menu-item';
import { ToastService } from '@utils/toast.service';
import { QrService } from '@utils/qr.service';
import { Web3Service } from '@utils/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent implements OnInit {
  private readonly qrSelector = 'qr-overlay';

  menuItems = [
    new MenuItem('Vouchers', '/vouchers', 'icon-my_funds'),
    new MenuItem('Ik wil sponsor worden', '/ik-wil-sponsor-worden', 'icon-plus')
  ];
  title = 'Platform Forus';

  constructor(
    private qrService: QrService,
    private toastService: ToastService,
    private _web3Service: Web3Service
  ) {}

  ngOnInit() {
  }

  private qrClick(event) {
    if (!!event.target && event.target.id === this.qrSelector) {
      this.qrService.close();
    }
  }
}
