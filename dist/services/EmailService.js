"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const logger_1 = require("../utils/logger");
const queue_1 = require("../utils/queue");
class EmailService {
    providers;
    queue;
    logger;
    maxRetries;
    constructor(providers, maxRetries = 3) {
        this.providers = providers;
        this.queue = new queue_1.Queue();
        this.logger = new logger_1.Logger();
        this.maxRetries = maxRetries;
    }
    async sendEmail(email) {
        let attempt = 0;
        let lastError = null;
        while (attempt < this.maxRetries) {
            const provider = this.providers[attempt % this.providers.length];
            try {
                await provider.send(email);
                this.logger.log(`Email sent successfully with ${provider.name}`);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    this.logger.error(`Failed with ${provider.name}: ${error.message}`);
                    lastError = error;
                }
                else {
                    this.logger.error(`Unknown error with ${provider.name}`);
                    lastError = new Error("Unknown error");
                }
                await this.backoff(attempt);
            }
            attempt++;
        }
        this.logger.error(`All providers failed. Last error: ${lastError?.message}`);
        throw lastError;
    }
    async backoff(attempt) {
        const delay = Math.pow(2, attempt) * 100;
        return new Promise((resolve) => setTimeout(resolve, delay));
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map