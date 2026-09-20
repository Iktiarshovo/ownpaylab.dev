import { OwnPayMCPServer, OWNPAY_TOOLS } from '../packages/mcp-server/src/server';

describe('@ownpay/mcp-server - Model Context Protocol Server Suite', () => {
  const mcpServer = new OwnPayMCPServer('https://api.ownpaylab.dev', 'own_test_mcp_mock_key');

  it('1. should declare all canonical MCP payment & agent tools in manifest', () => {
    const toolNames = OWNPAY_TOOLS.map((t) => t.name);

    expect(toolNames).toContain('create_payment_intent');
    expect(toolNames).toContain('check_intent_status');
    expect(toolNames).toContain('request_agent_payment');
    expect(toolNames).toContain('check_wallet_balance');
    expect(toolNames).toContain('request_x402_quote');
    expect(toolNames).toContain('verify_wallet');
    expect(toolNames).toContain('check_limits');
    expect(toolNames).toContain('list_agents');
    expect(toolNames).toContain('get_agent_policy');
    expect(toolNames).toContain('create_agent_payment_request');
  });

  it('2. should verify EVM wallet address format in verify_wallet tool', async () => {
    // Valid 42-char hex EVM address
    const validRes = await mcpServer.handleToolCall('verify_wallet', {
      walletAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    });
    expect(validRes).toContain('✅ Wallet Verified on Base');

    // Invalid format
    const invalidRes = await mcpServer.handleToolCall('verify_wallet', {
      walletAddress: 'not_a_valid_wallet_address',
    });
    expect(invalidRes).toContain('❌ Invalid EVM wallet address format');
  });

  it('3. should generate HTTP 402 challenge quote in request_x402_quote tool', async () => {
    const res = await mcpServer.handleToolCall('request_x402_quote', {
      resourcePath: '/api/v1/x402/data-feed',
    });
    expect(res).toContain('HTTP 402 Paywall Challenge');
    expect(res).toContain('USDC');
  });

  it('4. should process JSON-RPC tools/list and tools/call protocol requests', async () => {
    // Protocol tools/list
    const listMsg = await mcpServer.processMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
    });
    expect(listMsg.result.tools.length).toBeGreaterThanOrEqual(10);

    // Protocol tools/call
    const callMsg = await mcpServer.processMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'verify_wallet',
        arguments: { walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
      },
    });
    expect(callMsg.result.content[0].text).toContain('✅ Wallet Verified on Base');
  });
});
