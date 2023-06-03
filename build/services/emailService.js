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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToken = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const ses = new client_ses_1.SESClient({});
function createSendEmailCommand(ToAddress, fromAddress, message) {
    return new client_ses_1.SendEmailCommand({
        Destination: {
            ToAddresses: [ToAddress],
        },
        Source: fromAddress,
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: "Your one-time password",
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: message,
                },
            },
        },
    });
}
function sendEmailToken(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = `Your one-time password is :${token}`;
        const command = createSendEmailCommand(email, "haseeb.rehman2868@gmail.com", message);
        try {
            return yield ses.send(command);
        }
        catch (error) {
            console.log("Error sending email", error);
            return error;
        }
    });
}
exports.sendEmailToken = sendEmailToken;
// sendEmailToken("haseeb@yahoo.com","124")
