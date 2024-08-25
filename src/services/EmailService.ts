import { Provider } from "../types/provider-types";
import { Email } from "../types/email-types";
import { Logger } from "../utils/logger";
import { Queue } from "../utils/queue";

export class EmailService {
  private providers: Provider[];
  private queue: Queue;
  private logger: Logger;
  private maxRetries: number;

  constructor(providers: Provider[], maxRetries = 3) {
    this.providers = providers;
    this.queue = new Queue();
    this.logger = new Logger();
    this.maxRetries = maxRetries;
  }

  public async sendEmail(email: Email): Promise<void> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.maxRetries) {
      const provider = this.providers[attempt % this.providers.length];
      try {
        await provider.send(email);
        this.logger.log(`Email sent successfully with ${provider.name}`);
        return;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error(`Failed with ${provider.name}: ${error.message}`);
          lastError = error;
        } else {
          this.logger.error(`Unknown error with ${provider.name}`);
          lastError = new Error("Unknown error");
        }
        await this.backoff(attempt);
      }
      attempt++;
    }
    this.logger.error(
      `All providers failed. Last error: ${lastError?.message}`
    );
    throw lastError;
  }

  private async backoff(attempt: number) {
    const delay = Math.pow(2, attempt) * 100;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
