import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VoucherListComponent } from '@app/vouchers/list/voucher-list.component';
import { CreateTokenComponent } from '@app/create-token/create-token.component';
import { EditTokenComponent } from '@app/edit-token/edit-token.component';

const routes: Routes = [
  { path: '', redirectTo: '/vouchers', pathMatch: 'full' },
  { path: 'vouchers', component: VoucherListComponent },
  { path: 'ik-wil-sponsor-worden', component: CreateTokenComponent },
  { path: 'voucher-wijzigen/:address', component: EditTokenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
