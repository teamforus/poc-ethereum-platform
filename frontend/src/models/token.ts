
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
    this.expirationDate = new Date(expirationTimestamp);
  }

  get expired(): boolean {
    return this.state === 2;
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