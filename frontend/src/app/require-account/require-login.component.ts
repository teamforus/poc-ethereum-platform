import { Component, OnInit } from '@angular/core';
import { VaultService } from '@utils/vault.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-require-login',
  templateUrl: './require-login.component.html',
  styleUrls: ['./require-login.component.scss']
})
export class RequireLoginComponent implements OnInit {

  constructor(
    private _router: Router,
    private _vaultService: VaultService
  ) { }

  get hasLoggedIn(): boolean {
    return this._vaultService.hasAccount;
  }

  ngOnInit() {
    if (this._vaultService.hasAccount) {
      this._router.navigateByUrl('/');
    }
  }
}
