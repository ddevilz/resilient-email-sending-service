"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderA = void 0;
class ProviderA {
    name = "ProviderA";
    async send(email) {
        if (Math.random() > 0.5)
            throw new Error("ProviderA failed to send email");
        console.log(`ProviderA sent email to ${email.to}`);
    }
}
exports.ProviderA = ProviderA;
//# sourceMappingURL=providerA.js.map