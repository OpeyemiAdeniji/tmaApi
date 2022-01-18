/** Abstract Class Listener
 *
 * @class Listener
 *
*/
import nats, { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects.ev';
interface IListener {
    subject: Subjects;
    client: Stan;
    _ackwait: number;
    queueGroupName: any;
    subscriptionOptions(): any;
    onMessage(data: object, message: any): void;
    parseMessage(message: any): object;
    listen(): void;
}
declare class Listener implements IListener {
    subject: any;
    queueGroupName: any;
    client: Stan;
    _ackwait: number;
    constructor(client: Stan);
    subscriptionOptions(): nats.SubscriptionOptions;
    listen(): void;
    parseMessage(message: any): object;
    onMessage(data: object, message: any): void;
}
export default Listener;
