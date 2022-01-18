/** Abstract Class Publisher
 *
 * @class Publisher
 *
*/
import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects.ev';
interface IPublisher {
    subject: Subjects;
    client: Stan;
    publish(data: object): Promise<any>;
}
declare class Publisher implements IPublisher {
    subject: any;
    client: Stan;
    constructor(client: Stan);
    publish(data: object | any): Promise<any>;
}
export default Publisher;
