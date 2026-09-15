/**
 * Express x402 Payment Required Server Sample
 * Protects an API route with micro-payments using HTTP 402 protocol standards.
 */

import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

const RECIPIENT_WALLET = '0xYourMerchantSettlementAddress1234567890abcdef';
const PRICE_USDC = '0.002'; // 0.2 cents

// Lightweight x402 monetization middleware
function requireX402Payment(req: Request, res: Response, next: NextFunction) {
  const paymentProof = req.headers['x-ownpay-payment-proof'];

  if (!paymentProof) {
    // Challenge client with HTTP 402 Payment Required
    res.setHeader('X-OwnPay-Version', '2026-09-01');
    res.setHeader('X-OwnPay-Invoice-Id', `inv_${Date.now()}`);
    res.setHeader('X-OwnPay-Amount', PRICE_USDC);
    res.setHeader('X-OwnPay-Currency', 'USDC');
    res.setHeader('X-OwnPay-Chain', 'base');
    res.setHeader('X-OwnPay-Pay-To', RECIPIENT_WALLET);

    return res.status(402).json({
      error: 'payment_required',
      message: `Access requires ${PRICE_USDC} USDC on Base`,
      docs: 'https://www.ownpaylab.dev/docs/x402',
    });
  }

  // Verify payment proof format
  if (typeof paymentProof === 'string' && paymentProof.startsWith('pproof_')) {
    console.log(`[x402] Verified payment proof: ${paymentProof}`);
    return next();
  }

  return res.status(403).json({ error: 'invalid_payment_proof' });
}

// Protected resource
app.get('/api/weather/radar', requireX402Payment, (req: Request, res: Response) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    radarData: {
      precipitationProbability: 0.12,
      cloudCover: 'scattered',
      windSpeedKnots: 8.5,
    },
  });
});

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`x402 Monetized Server running on http://localhost:${PORT}`);
});
