import { OwnPayClient, OwnPayWebhook, CreateIntentParams, OwnPayWebhookEvent } from '../../sdk/src';

export interface NextAdapterOptions {
  apiKey: string;
  baseUrl?: string;
  webhookSecret?: string;
}

/**
 * Creates a Next.js 14/15 App Router checkout endpoint handler in under 10 lines of code.
 *
 * Example usage in `app/api/checkout/route.ts`:
 * ```ts
 * import { createOwnPayNextCheckoutHandler } from '@ownpay/adapters/next';
 *
 * export const POST = createOwnPayNextCheckoutHandler({
 *   apiKey: process.env.OWNPAY_API_KEY!,
 * });
 * ```
 */
export function createOwnPayNextCheckoutHandler(options: NextAdapterOptions) {
  const client = new OwnPayClient({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl || 'https://ownpaylab.tech'
  });

  return async function POST(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const params: CreateIntentParams = {
        orderId: body.orderId || `order_${Date.now()}`,
        amount: Number(body.amount),
        currency: body.currency || 'USD',
        title: body.title,
        customerEmail: body.customerEmail,
        webhookUrl: body.webhookUrl,
        chain: body.chain,
        asset: body.asset,
      };

      const intent = await client.intents.create(params);

      return new Response(
        JSON.stringify({
          success: true,
          data: intent,
          checkoutUrl: `${client.baseUrl}/pay?intent_id=${intent.intent_id}`
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ success: false, error: err.message || 'Checkout failed' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Creates a Next.js 14/15 App Router webhook verification handler.
 *
 * Example usage in `app/api/webhooks/ownpay/route.ts`:
 * ```ts
 * import { createOwnPayNextWebhookHandler } from '@ownpay/adapters/next';
 *
 * export const POST = createOwnPayNextWebhookHandler({
 *   webhookSecret: process.env.OWNPAY_WEBHOOK_SECRET!,
 *   onEvent: async (event) => {
 *     if (event.event === 'intent.settled') {
 *       // Fulfill order
 *     }
 *   }
 * });
 * ```
 */
export function createOwnPayNextWebhookHandler(config: {
  webhookSecret: string;
  onEvent: (event: OwnPayWebhookEvent) => Promise<void> | void;
}) {
  return async function POST(req: Request): Promise<Response> {
    try {
      const signature = req.headers.get('x-ownpay-signature') || '';
      const timestamp = req.headers.get('x-ownpay-timestamp') || '';
      const rawBody = await req.text();

      const event = OwnPayWebhook.constructEvent(
        rawBody,
        signature,
        timestamp,
        config.webhookSecret
      );

      await config.onEvent(event);

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || 'Invalid webhook signature' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}
