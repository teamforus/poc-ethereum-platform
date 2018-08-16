import { Event } from '@models/event';

export class ApprovalEvent extends Event {
    constructor(
        tokenName:string
    ) {
        super ('Approval', {
            name: tokenName
        });
    }

    get tokenName():string {
        return this.data['name'];
    }
}