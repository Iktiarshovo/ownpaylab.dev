from typing import Any, Dict, Optional

class IntentsAPI:
    def __init__(self, client):
        self._client = client

    def create(
        self,
        order_id: str,
        amount: float,
        currency: str = "USD",
        title: Optional[str] = None,
        webhook_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        chain: Optional[str] = "base",
        asset: Optional[str] = "USDC",
    ) -> Dict[str, Any]:
        payload = {
            "order_id": order_id,
            "amount": amount,
            "currency": currency,
        }
        if title:
            payload["title"] = title
        if webhook_url:
            payload["webhook_url"] = webhook_url
        if metadata:
            payload["metadata"] = metadata
        if chain:
            payload["chain"] = chain
        if asset:
            payload["asset"] = asset

        return self._client.request("POST", "/api/v1/intents", json_data=payload)

    def get(self, intent_id: str) -> Dict[str, Any]:
        return self._client.request("GET", f"/api/v1/intents/{intent_id}")

    def get_status(self, intent_id: str) -> Dict[str, Any]:
        return self._client.request("GET", f"/api/v1/intents/{intent_id}/status")
