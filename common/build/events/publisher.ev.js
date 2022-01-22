"use strict";
/** Abstract Class Publisher
 *
 * @class Publisher
 *
*/
Object.defineProperty(exports, "__esModule", { value: true });
var Publisher = /** @class */ (function () {
    function Publisher(client) {
        this.client = client;
    }
    Publisher.prototype.publish = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.publish(_this.subject, JSON.stringify(data), function (err) {
                if (err) {
                    reject(err);
                }
                console.log("Event published to channel ".concat(_this.subject));
                resolve();
            });
        });
    };
    return Publisher;
}());
exports.default = Publisher;
