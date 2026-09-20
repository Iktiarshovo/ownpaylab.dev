from typing import Any, Dict, List, Optional

class AgentsAPI:
    def __init__(self, client):
        self._client = client

    def list(self) -> List[Dict[str, Any]]:
        res = self._client.request("GET", "/v1/agents")
        return res if isinstance(res, list) else res.get("data", [])

    def get(self, agent_id: str) -> Dict[str, Any]:
        return self._client.request("GET", f"/v1/agents/{agent_id}")

    def create(
        self,
        name: str,
        description: Optional[str] = None,
        default_chain: str = "base",
        default_token: str = "USDC"
    ) -> Dict[str, Any]:
        payload = {
            "name": name,
            "defaultChain": default_chain,
            "defaultToken": default_token,
        }
        if description:
            payload["description"] = description
        return self._client.request("POST", "/v1/agents", json_data=payload)

    def pay(
        self,
        agent_id: str,
        amount: float,
        recipient: str,
        token: str = "USDC",
        chain: str = "base",
        purpose: Optional[str] = None,
    ) -> Dict[str, Any]:
        payload = {
            "agentId": agent_id,
            "amount": amount,
            "recipient": recipient,
            "token": token,
            "chain": chain,
        }
        if purpose:
            payload["purpose"] = purpose
        return self._client.request("POST", "/v1/payments", json_data=payload)

    def freeze(self, agent_id: str) -> Dict[str, Any]:
        return self._client.request("POST", f"/v1/agents/{agent_id}/freeze")

    def unfreeze(self, agent_id: str) -> Dict[str, Any]:
        return self._client.request("POST", f"/v1/agents/{agent_id}/unfreeze")
