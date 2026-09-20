import { OwnPayClient } from '../../sdk/src';

export interface BotTipOptions {
  userId: string;
  amountUsdc: number;
  reason?: string;
}

export class OwnPayBotPlugin {
  private client: OwnPayClient;

  constructor(apiKey: string, baseUrl = 'https://ownpaylab.tech') {
    this.client = new OwnPayClient({ apiKey, baseUrl });
  }

  /**
   * Generates a Discord embed or Telegram reply with a 1-tap Base payment link
   */
  async createTipLink(options: BotTipOptions): Promise<{ checkoutUrl: string; intentId: string; qrData: string }> {
    const orderId = `tip_${options.userId}_${Date.now()}`;
    const intent = await this.client.intents.create({
      orderId,
      amount: options.amountUsdc,
      currency: 'USD',
      title: options.reason || `Community Tip from User ${options.userId}`
    });

    return {
      checkoutUrl: `${this.client.baseUrl}/pay?intent_id=${intent.intent_id}`,
      intentId: intent.intent_id,
      qrData: intent.qr_data
    };
  }

  /**
   * Polls or checks if a tip or unlock payment has settled
   */
  async isTipSettled(intentId: string): Promise<boolean> {
    const status = await this.client.intents.verify(intentId);
    return status.settled === true;
  }
}
