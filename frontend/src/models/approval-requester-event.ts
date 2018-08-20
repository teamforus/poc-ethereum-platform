import { Event } from '@models/event';

export class ApprovalRequesterEvent extends Event {
    constructor(
        tokenName:string,
        requesterName: string
    ) {
        super ('Approval', {
            tokenName: tokenName,
            requesterName: requesterName
        });
    }

    get tokenName():string {
        return this.data['name'];
    }

    get requesterName(): string {
        return this.data['requesterName'];
    }
}