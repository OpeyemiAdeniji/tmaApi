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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRolesByName = void 0;
var db_mw_1 = require("./db.mw");
var findByName = function (model, name) { return __awaiter(void 0, void 0, void 0, function () {
    var role;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model.findOne({ name: name })];
            case 1:
                role = _a.sent();
                return [2 /*return*/, role];
        }
    });
}); };
var getRoleName = function (model, id) { return __awaiter(void 0, void 0, void 0, function () {
    var role;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model.findOne({ _id: id })];
            case 1:
                role = _a.sent();
                return [2 /*return*/, role];
        }
    });
}); };
var getRolesByName = function (roles, authType, authDB) { return __awaiter(void 0, void 0, void 0, function () {
    var Role, result, authorized;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, db_mw_1.getRoleModel)(authType, authDB)];
            case 1:
                Role = _a.sent();
                result = roles.map(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, findByName(Role, r)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); });
                authorized = Promise.all(result);
                return [2 /*return*/, authorized];
        }
    });
}); };
exports.getRolesByName = getRolesByName;
// export const getRoleNames = async (roleIDs: Array<string>): Promise<any> => {
//     const Role = await getRoleModel();
//     const result = roleIDs.map(async (id) => await getRoleName(Role, id));
//     const rIds = Promise.all(result);
//     return rIds;
// }
