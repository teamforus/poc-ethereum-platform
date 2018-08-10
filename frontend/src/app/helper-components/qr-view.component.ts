import { Component, OnInit } from '@angular/core';
import { QrCode } from 'qrcode';
import { QrService } from '@utils/qr.service';

@Component({
  selector: 'qr-view',
  templateUrl: './qr-view.component.html',
  styleUrls: ['./qr-view.component.scss']
})
export class QrViewComponent implements OnInit {

  constructor(
    private qrService: QrService
  ) {}

  async ngOnInit() {

  }

}