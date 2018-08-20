
export class Token {
  public expirationDate: Date;

  constructor(
    public address: string,
    public owner: string,
    public name: string,
    public enabled: boolean,
    public expirationTimestamp: number,
    public providers: string[] = [],
  ) {
    // Javascript millisecond fix
    //this.expirationTimestamp *= 1000; 
    this.expirationDate = new Date(expirationTimestamp*1000);
  }

  approvals: string[] = [];
  providerRequests: string[] = [];

  get expired(): boolean {
    return this.state === 2;
  }

  get hasProviders(): boolean {
    return !!this.providers && !!this.providers.length;
  }

  hasRequested(address: string): boolean {
    this.approvals.forEach(approval => {
      if (approval.toUpperCase() === address.toUpperCase()) {
        return true;
      }
    });
    return false;
  }

  isOwner(address:string): boolean {
    if (!!address && !!address.toLowerCase) {
      return (address.toLowerCase() === this.owner.toLowerCase());
    }
    return false;
  }

  /**
   * The state of the token. 
   * @returns 0 if not enabled yet, 1 is enabled and not expired, 2 if expired.
   */
  get state(): number {
    if (this.expirationTimestamp < (new Date()).getTime()/1000) {
      return 2;
    } else if (!this.enabled) {
      return 0;
    } else {
      return 1; 
    }
  }
}