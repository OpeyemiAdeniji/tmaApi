"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToday = exports.convertUrlToBase64 = exports.isEmptyObject = exports.dateToWordRaw = exports.dateToWord = exports.arrayIncludes = exports.strIncludesEs6 = exports.strIncludes = exports.strToArrayEs6 = exports.strToArray = exports.isArray = exports.isString = exports.isObject = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(customParseFormat_1.default);
var https_1 = __importDefault(require("https"));
var isObject = function (arg) {
    var ty = typeof arg;
    return ty === 'object' ? true : false;
};
exports.isObject = isObject;
var isString = function (arg) {
    var ty = typeof arg;
    return ty === 'string' ? true : false;
};
exports.isString = isString;
var isArray = function (arg) {
    var res = false;
    if (Array.isArray) {
        res = Array.isArray(arg);
    }
    return res;
};
exports.isArray = isArray;
var strToArray = function (arg, split) {
    return arg.split(split);
};
exports.strToArray = strToArray;
var strToArrayEs6 = function (arg, split) {
    return arg.split(split);
};
exports.strToArrayEs6 = strToArrayEs6;
var strIncludes = function (arg, inc) {
    return arg.indexOf(inc) ? true : false;
};
exports.strIncludes = strIncludes;
var strIncludesEs6 = function (arg, inc) {
    return arg.includes(inc) ? true : false;
};
exports.strIncludesEs6 = strIncludesEs6;
var arrayIncludes = function (arr, inc) {
    return arr.includes(inc) ? true : false;
};
exports.arrayIncludes = arrayIncludes;
var dateToWord = function (date) {
    var theDate = (0, dayjs_1.default)(date).toString();
    return theDate;
};
exports.dateToWord = dateToWord;
var dateToWordRaw = function () {
    var theDate = (0, dayjs_1.default)().toString();
    return theDate;
};
exports.dateToWordRaw = dateToWordRaw;
var isEmptyObject = function (obj) {
    return Object.keys(obj).length === 0;
};
exports.isEmptyObject = isEmptyObject;
var convertUrlToBase64 = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        body = null;
        return [2 /*return*/, new Promise(function (resolve, reject) {
                https_1.default.get(url, function (resp) {
                    resp.setEncoding('base64');
                    body = "data:" + resp.headers["content-type"] + ";base64,";
                    resp.on('data', function (data) { body += data; });
                    resp.on('end', function () {
                        try {
                            resolve(body);
                        }
                        catch (e) {
                            reject(e.message);
                        }
                    });
                }).on('error', function (e) {
                    reject("Got error: ".concat(e.message));
                });
            })];
    });
}); };
exports.convertUrlToBase64 = convertUrlToBase64;
var dateToday = function () {
    var today = (0, dayjs_1.default)(); // today's date
    var day = today.get('date');
    var month = today.get('month');
    var year = today.get('year');
    var hour = today.get('hour');
    var min = today.get('minutes');
    var sec = today.get('seconds');
    var milli = today.get('milliseconds');
    return { year: year, month: month, day: day, hour: hour, min: min, sec: sec, milli: milli };
};
exports.dateToday = dateToday;
