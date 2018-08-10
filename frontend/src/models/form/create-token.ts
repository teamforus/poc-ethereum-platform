export class Token {
    name: string;
    fundSize: number;
    initialFund: number;
    expiresOn:string = Token.defaultDate;

    get expiresOnNumber(): number {
        const date = new Date(this.expiresOn);
        return date.getTime()/1000;
    }

    private static get defaultDate():string {
        let ret = new Date();
        ret.setFullYear(ret.getFullYear()+1, 0, 1);
        return ret.getUTCFullYear() + "-" + (ret.getUTCMonth() < 9 ? '0' : '') + (ret.getUTCMonth()+1) + "-" + (ret.getUTCDate() < 10 ? '0' : '') + ret.getUTCDate(); 
    }
}   