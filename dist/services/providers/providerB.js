"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderB = void 0;
class ProviderB {
    name = "ProviderB";
    async send(email) {
        if (Math.random() > 0.5)
            throw new Error("ProviderB failed to send email");
        console.log(`ProviderB sent email to ${email.to}`);
    }
}
exports.ProviderB = ProviderB;
//# sourceMappingURL=providerB.js.map