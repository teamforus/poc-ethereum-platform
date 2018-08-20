import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Token } from '@models/token';
import { Token as CreateToken } from '@models/form/create-token';
import { AppService, AppMessage } from '@utils/app.service';
import * as tokenAbi from '@contracts/forus-token';
import * as platformAbi from '@contracts/platform-forus';
import * as Web3 from 'web3';
import { VaultService } from '@utils/vault.service';
import { Contract, EventLog } from 'web3/types';
import { Event } from '@models/event';
import { EventService } from '@utils/event.service';
import { ToastService } from '@utils/toast.service';
import { ApprovalRequesterEvent } from '@models/approval-requester-event';
import { ApprovalSponsorEvent } from '@models/approval-sponsor-event';
import { Account } from '@models/account';

@Injectable()
export class Web3Service {
  // In case of emergancy private static readonly PLATFORM_ADDRESS = '0xd7562879aaea423f0a9e44e264d3bbf8d1d2f57c';
  private static readonly PLATFORM_ADDRESS = '0xf75779656434e06ed7dd6dfbbec3cecabb80f266';
  private static readonly TRANSACTION_TEMPLATE = {
    value: 0,
    chainId: 3177,
    gas: 8000000, 
    gasPrice: 1
  };
  private static readonly WEB3_CONNECTION_STRING = 'ws://10.10.12.85:8546';

  private _approvals;
  private _approvalsLoaded = false; 
  private _whisperPrivateKey;
  private _whisperPublicKey;
  private _platformContract;
  private _tokens: BehaviorSubject<Token[]> = new BehaviorSubject([]);
  public readonly tokens: Observable<Token[]> = this._tokens.asObservable();
  private readonly _tokenListeners: string[] = [];

  readonly chainId = 3177;
  // @ts-ignore
  web3: Web3;
 
  constructor(
    private _appService: AppService,
    private _eventService: EventService,
    private _vaultService: VaultService
  ) {
    // @ts-ignore
    this.web3 = new Web3(Web3Service.WEB3_CONNECTION_STRING);
    this.web3.shh.newKeyPair().then((keyPair) => {
      this.initializeWhisper(keyPair);
    });
    this._platformContract = new this.web3.eth.Contract(platformAbi, Web3Service.PLATFORM_ADDRESS);
    this.updateTokens();
    this._platformContract.events.TokenAdded(this.updateTokens.bind(this));

  }

  async canSucceed(transaction: Object): Promise<boolean> {
    let gas = -1;
    try {
      gas = await this.getGasEstimate(transaction);
    } finally {
      return gas > 0;
    }
  }

  async createTransaction(from: string, to: string, dataAbi: string = undefined): Promise<JSON> {
    let transaction = JSON.parse(
      JSON.stringify(Web3Service.TRANSACTION_TEMPLATE)
    );
    transaction['from'] = from;
    transaction['to'] = to;
    transaction['nonce'] = await this.nonce(from);
    if (!!dataAbi) transaction['data'] = dataAbi;
    return transaction;
  } 

  private async getContract(abi, address: string): Promise<Contract> {
    return new this.web3.eth.Contract(abi, address); 
  }

  async getGasEstimate(transaction: Object): Promise<number> {
    const gas = await this.web3.eth.estimateGas(transaction);
    return gas;
  }

  async getTokenByAddress(address: string): Promise<Token> {
    const contract = await this.getTokenContract(address);
    let providers = [];
    const providerCount = await contract.methods.providerCount().call();
    for (let p = 0; p < providerCount; p++) { 
      providers.push(await contract.methods.providers(p).call());
    }
    const token = new Token(
      address,
      await contract.methods.owner().call(),
      await contract.methods.name().call(),
      await contract.methods.enabled().call(),
      await contract.methods.expiresOn().call(),
      providers
    );
    if (token.enabled) {
      contract.getPastEvents('Approval', { fromBlock: 0, toBlock: 'latest' }, (error, events) => {
        events.forEach(event => {
          token.approvals.push(event.returnValues['spender']);
        });
      });
      /*contract.getPastEvents('ProviderApplicationReceived', {fromBlock: 0, toBlock: 'latest'}, (error, events) => {
        events.forEach(event => {
          token.providerRequests.push(event.returnValues['_applicationAddress']);
        })
      })*/
    }
    return token;
  }

  private async getTokenContract(address: string): Promise<Contract> {
    return await this.getContract(tokenAbi, address);
  }

  private initializeWhisper(privateKey) {
    this._whisperPrivateKey = privateKey;
    this.web3.shh.getPublicKey(this._whisperPrivateKey).then((publicKey) => {
      this._whisperPublicKey = publicKey;
      // always put the public key in the body of qr codes 
      this._appService.addHeader('publicKey', publicKey);
      console.log('Public key of whisper: ' + publicKey);
    });
    // subscribe to messages, directed at this private key
    this.web3.shh.subscribe('messages', {
      privateKeyID: privateKey
    }, this.onWhisperMessage.bind(this));
  }

  isValidAddress(address:string): boolean {
    return this.web3.utils.isAddress(address);
  }

  private async listenToToken(address: string) {
    let isNew = true;
    for (let i = 0; i < this._tokenListeners.length; i++) {
      if (address === this._tokenListeners[i]) {
        isNew = false;
      }
    }
    if (isNew) {
      const tokenContract = await this.getTokenContract(address);
      tokenContract.events.Approval((async (_, event) => {
        const token: Token = await this.getTokenByAddress(event.address);
        let account:Account = this._vaultService.getAccountByAddress(event.returnValues['spender'])
        if (!!account) {
          this._eventService.onEvent(new ApprovalRequesterEvent(token.name, account.name));
        }
        account = this._vaultService.getAccountByAddress(event.returnValues['tokenOwner']);
        if (!!account) {
          this._eventService.onEvent(new ApprovalSponsorEvent(token.name, event.returnValues['spender']));
        }
      }).bind(this));
      tokenContract.events.Enabled(this.updateTokens.bind(this));
      this._tokenListeners.push(address);
    }
  }

  /** 
   * Get the nonce of the sender
   * @param string The address for which you want the nonce of
   * @returns Promise with the nonce
   */
  async nonce(sender: string): Promise<number> {
    return await this.web3.eth.getTransactionCount(sender);
  }

  // Could have third parameter 'subscription'
  private onWhisperMessage(error, message) {
    if (!error) {
      const json = JSON.parse(this.web3.utils.toAscii(message.payload));
      const appMessage = new AppMessage(json.id, json.request, json.body)
      this._appService.emit(appMessage);
    } else { 
      console.error(error);
    }
  }
 
  async prepareAddProvider(token: Token, providerAddress:string): Promise<Object> {
    const contract = await this.getTokenContract(token.address);
    const data = contract.methods.addProvider(
      providerAddress
    );
    const sender = this._vaultService.currentAddress;
    const transaction = this.createTransaction(sender, token.address, data.encodeABI());
    let canSucceed = await this.canSucceed(transaction);
    return canSucceed ? transaction : null;
  }
 
  async prepareApplyForProvider(token: Token): Promise<Object> {
    const contract = await this.getTokenContract(token.address);
    const data = contract.methods.applyForProvider(
      this._vaultService.currentAddress
    );
    const sender = this._vaultService.currentAddress;
    const transaction = this.createTransaction(sender, token.address, data.encodeABI());
    let canSucceed = await this.canSucceed(transaction);
    return canSucceed ? transaction : null;
  }

  async prepareCreateToken(token: CreateToken): Promise<Object> {
    const data = this._platformContract.methods.createToken(
      token.name,
      token.fundSize,
      token.initialFund,
      token.expiresOnNumber
    );
    const sender = this._vaultService.currentAccount.address;
    const transaction = this.createTransaction(sender, Web3Service.PLATFORM_ADDRESS, data.encodeABI());
    let canSucceed = await this.canSucceed(transaction);
    return canSucceed ? transaction : null;
  }

  async prepareEnableToken(token: Token) {
    const sender = this._vaultService.currentAddress;
    const contract = await this.getTokenContract(token.address);
    const data = contract.methods.enable();
    const transaction = await this.createTransaction(sender, token.address, data.encodeABI());
    let canSucceed = await this.canSucceed(transaction);
    return (canSucceed) ? transaction : null;
  }

  async prepareRequestToken(token: Token) {
    const sender = this._vaultService.currentAddress;
    const contract = await this.getTokenContract(token.address);
    const data = contract.methods.requestFor(token.owner, sender);
    const transaction = await this.createTransaction(sender, token.address, data.encodeABI());
    let canSucceed = await this.canSucceed(transaction);
    return (canSucceed) ? transaction : null;
  }

  async refreshToken(token:Token) {
    const newToken = await this.getTokenByAddress(token.address);
    token.approvals = newToken.approvals;
    token.enabled = newToken.enabled;
    token.providers = newToken.providers;
  }

  async sendSignedTransaction(trx: object, privateKey: string) {
    return this.web3.eth.accounts.signTransaction(trx, privateKey)
      .then((sgnTrx) => {
        return this.web3.eth.sendSignedTransaction(sgnTrx.rawTransaction);
      }).then((result) => {
        return result;
      }).catch((error) => {
        throw new Error(error);
      });
  }

  private async updateTokens() {
    const length = await this._platformContract.methods.tokensLength().call().then((amount) => {
      // securing that length is always a number
      try {
        return parseInt(amount) || 0;
      } catch (e) {
        return 0;
      }
    });
    let currentAddress, currentToken;
    let tokens = [];
    for (let i = 0; i < length; i++) {
      currentAddress = await this._platformContract.methods.tokens(i).call();
      if (!!currentAddress) {
        currentToken = await this.getTokenByAddress(currentAddress);
        tokens.push(currentToken);
        this.listenToToken(currentAddress);
      }
    }
    this._tokens.next(tokens);
  }

  async validatePermissions(): Promise<boolean> {
    return false;
  }

}

export interface MessageListener {
  onMessage(message: Object);
}