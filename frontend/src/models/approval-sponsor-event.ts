import { Event } from '@models/event';

export class ApprovalSponsorEvent extends Event {
    constructor(
        tokenName:string,
        requesterAddress: string
    ) {
        super ('Approval', {
            tokenName: tokenName,
            requesterAddress: requesterAddress
        });
    }

    get tokenName():string {
        return this.data['name'];
    }

    get requesterAddress(): string {
        return this.data['requesterAddress'];
    }
}