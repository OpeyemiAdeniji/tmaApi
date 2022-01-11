"use strict";
/** Abstract Class Listener
 *
 * @class Listener
 *
*/
Object.defineProperty(exports, "__esModule", { value: true });
var Listener = /** @class */ (function () {
    function Listener(client) {
        this._ackwait = 5 * 1000;
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this._ackwait)
            .setStartAtTimeDelta(1 * 1000) // starting at a specific amount of time in the past 
            .setDurableName(this.queueGroupName);
    };
    Listener.prototype.listen = function () {
        var _this = this;
        // create the subscription
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', function (msg) {
            console.log("Message recieved from ".concat(_this.subject, "/").concat(_this.queueGroupName));
            var parsedData = _this.parseMessage(msg);
            _this.onMessage(parsedData, msg);
        });
    };
    Listener.prototype.parseMessage = function (message) {
        var data = message.getData();
        return typeof (data) === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    };
    Listener.prototype.onMessage = function (data, message) { };
    return Listener;
}());
exports.default = Listener;
