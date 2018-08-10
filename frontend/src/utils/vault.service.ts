import { Web3Service } from '@utils/web3.service';
import { Injectable } from '@angular/core';
import { Account } from '@models/account';

@Injectable()
export class VaultService {
  private readonly ACCOUNT_KEY = 'accounts';
  private readonly ACCOUNT_CURRENT_KEY = 'current_account';
  private _accounts: Account[];
  public currentAccount: Account;

  constructor() {
    this._accounts = JSON.parse(localStorage.getItem(this.ACCOUNT_KEY)) || [];
    this.currentAccount = JSON.parse(localStorage.getItem(this.ACCOUNT_CURRENT_KEY)) || undefined;
  }

  get accounts(): Account[] {
    return this._accounts || [];
  }

  /**
   * Adds account to vault. Replaces account if address is already known.
   * @param account Account to be added
   * @returns Whether the account replaces a different account.
   */
  addAccount(account: Account): boolean {
    let accountFound = false;
    for (let i = 0; i < this._accounts.length; i++) {
      if (this._accounts[i].address === account.address) {
        accountFound = true;
        this._accounts[i].name = account.name;
      }
    }
    if (!accountFound) {
      this._accounts.push(account);
    }
    return accountFound;
  }
  
  get currentAddress(): string {
    if (!!this.currentAccount) {
      return this.currentAccount.address;
    }
    return undefined;
  }

  getAccountByAddress(address:string): Account {
    let ret;
    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].address === address) {
        ret = this.accounts[i];
      }
    }
    return ret;
  }

  isCurrent(address:string): boolean {
    return (!!this.currentAccount
      && address.toLowerCase() === this.currentAccount.address.toLowerCase());
  }

  reset() {
    this._accounts = Account[0];
    this.currentAccount = undefined;
    localStorage.removeItem(this.ACCOUNT_KEY);
    localStorage.removeItem(this.ACCOUNT_CURRENT_KEY);
  }

  saveAccounts() {
    localStorage.setItem(this.ACCOUNT_KEY, JSON.stringify(this._accounts));
    if (!this.currentAccount) {
      this.currentAccount = this.accounts[0];
      this.saveCurrentAccount();
    }
  }

  saveCurrentAccount() {
    localStorage.setItem(this.ACCOUNT_CURRENT_KEY, JSON.stringify(this.currentAccount));
  }

}
