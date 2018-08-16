import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoucherListComponent } from '@app/vouchers/list/voucher-list.component';
import { CreateTokenComponent } from '@app/create-token/create-token.component';
import { RequestComponent } from '@app/request/request.component';
import { VaultService } from '@utils/vault.service';
import { RequireLoginComponent } from '@app/require-account/require-login.component';
import { ViewTokenComponent } from '@app/view-token/view-token.component';

const routes: Routes = [
  { path: '', redirectTo: '/vouchers', pathMatch: 'full' },
  { path: 'vouchers', component: VoucherListComponent },
  { path: 'voucher/:address', component: ViewTokenComponent, pathMatch: 'full' },
  { path: 'voucher/:address/aanvragen', component: RequestComponent, canActivate: [VaultService], pathMatch: 'full' },
  { path: 'ik-wil-sponsor-worden', component: CreateTokenComponent, canActivate: [VaultService] },
  { path: 'account-vereist', component: RequireLoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
   

  constructor(
    private _vaultService: VaultService
  ) {}
}
