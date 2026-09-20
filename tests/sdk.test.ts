import crypto from 'crypto';
import { OwnPayClient, OwnPayWebhook, DEFAULT_OWNPAY_URL } from '../packages/sdk/src';
import type { CreateIntentParams, CreateAgentSessionParams } from '../packages/sdk/src/types';

describe('@ownpay/sdk - Official TypeScript SDK Test Suite', () => {
  const mockApiKey = 'own_sec_test_9876543210abcdef';
  const mockWebhookSecret = 'whsec_test_secret_abc123';

  describe('1. Client Initialization & Configuration', () => {
    it('should initialize client with default endpoint', () => {
      const client = new OwnPayClient({ apiKey: mockApiKey });
      expect(client).toBeDefined();
      expect(client.intents).toBeDefined();
      expect(client.products).toBeDefined();
      expect(client.orders).toBeDefined();
      expect(client.coupons).toBeDefined();
      expect(client.refunds).toBeDefined();
    });

    it('should accept custom baseUrl and network options', () => {
      const customUrl = 'https://api.custom-sandbox.ownpay.tech';
      const client = new OwnPayClient({
        apiKey: mockApiKey,
        baseUrl: customUrl,
        timeoutMs: 5000,
      });
      expect(client).toBeDefined();
    });
  });

  describe('2. OwnPayWebhook Cryptographic Signature Verification', () => {
    it('should successfully verify a valid HMAC-SHA256 webhook signature', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payload = JSON.stringify({
        event: 'intent.settled',
        intent_id: 'pi_test_12345678',
        amount: 25.5,
        currency: 'USDC',
        chain: 'base',
        tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      });

      const hash = crypto
        .createHmac('sha256', mockWebhookSecret)
        .update(`${timestamp}.${payload}`)
        .digest('hex');
      const signature = `v1=${hash}`;

      const isValid = OwnPayWebhook.verifySignature(
        payload,
        signature,
        timestamp,
        mockWebhookSecret,
        300
      );

      expect(isValid).toBe(true);
    });

    it('should strictly reject webhook if body payload has been tampered with', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const authenticPayload = JSON.stringify({ event: 'intent.settled', amount: 50.0 });
      const tamperedPayload = JSON.stringify({ event: 'intent.settled', amount: 5.0 });

      const authenticHash = crypto
        .createHmac('sha256', mockWebhookSecret)
        .update(`${timestamp}.${authenticPayload}`)
        .digest('hex');

      const isValid = OwnPayWebhook.verifySignature(
        tamperedPayload,
        `v1=${authenticHash}`,
        timestamp,
        mockWebhookSecret,
        300
      );

      expect(isValid).toBe(false);
    });

    it('should strictly reject webhook if timestamp is beyond tolerance window (replay protection)', () => {
      // 301 seconds in the past
      const expiredTimestamp = (Math.floor(Date.now() / 1000) - 301).toString();
      const payload = JSON.stringify({ event: 'intent.settled', amount: 10.0 });

      const hash = crypto
        .createHmac('sha256', mockWebhookSecret)
        .update(`${expiredTimestamp}.${payload}`)
        .digest('hex');

      const isValid = OwnPayWebhook.verifySignature(
        payload,
        `v1=${hash}`,
        expiredTimestamp,
        mockWebhookSecret,
        300
      );

      expect(isValid).toBe(false);
    });

    it('should strictly reject invalid signature or wrong secret', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payload = JSON.stringify({ event: 'ping' });

      const isValid = OwnPayWebhook.verifySignature(
        payload,
        'v1=invalid_tampered_signature_hex_value_00000000000000000000000000000000',
        timestamp,
        'wrong_secret',
        300
      );

      expect(isValid).toBe(false);
    });
  });

  describe('3. Multi-Chain Intent Parameters Structure', () => {
    it('should compile valid multi-chain intent specifications', () => {
      const baseIntent: CreateIntentParams = {
        amount: 49.99,
        currency: 'USD',
        orderId: 'ORDER_BASE_01',
        chain: 'base',
        asset: 'USDC',
      };
      expect(baseIntent.chain).toBe('base');

      const solanaIntent: CreateIntentParams = {
        amount: 10.0,
        currency: 'USD',
        orderId: 'ORDER_SOL_01',
        chain: 'solana',
        asset: 'USDC',
      };
      expect(solanaIntent.chain).toBe('solana');

      const bscIntent: CreateIntentParams = {
        amount: 100.0,
        currency: 'USD',
        orderId: 'ORDER_BSC_01',
        chain: 'bsc',
        asset: 'USDC',
      };
      expect(bscIntent.chain).toBe('bsc');
    });
  });

  describe('4. Agent Session Policy Construction', () => {
    it('should construct compliant agent session policies with gas boundaries', () => {
      const sessionParams: CreateAgentSessionParams = {
        agentId: 'agent_proc_99',
        maxSessionSpend: 50.0,
        maxPerTransaction: 10.0,
        allowedAsset: 'USDC',
        allowedChain: 'base',
        durationSeconds: 3600,
        allowedRecipients: ['0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'],
      };

      expect(sessionParams.maxSessionSpend).toBe(50.0);
      expect(sessionParams.allowedChain).toBe('base');
      expect(sessionParams.allowedRecipients).toContain('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
    });
  });
});
