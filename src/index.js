"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APISession = void 0;
var APISession = /** @class */ (function () {
    function APISession(base_url) {
        this.base_url = base_url;
    }
    APISession.prototype.fullUrl = function (endpoint) {
        return "".concat(this.base_url).concat(endpoint);
    };
    return APISession;
}());
exports.APISession = APISession;
