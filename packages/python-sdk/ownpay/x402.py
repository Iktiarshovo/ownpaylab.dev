from typing import Any, Dict

class X402API:
    def __init__(self, client):
        self._client = client

    def get_challenge(self, resource_path: str) -> Dict[str, Any]:
        return self._client.request("GET", f"/api/v1/x402/data-feed")

    def call_protected_feed(self, payment_proof: str) -> Dict[str, Any]:
        return self._client.request(
            "GET",
            "/api/v1/x402/data-feed",
            headers={"X-Payment-Proof": payment_proof}
        )
