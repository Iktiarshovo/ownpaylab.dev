import json
import urllib.request
import urllib.error
from typing import Any, Dict, Optional

from .payments import IntentsAPI
from .agents import AgentsAPI
from .x402 import X402API

DEFAULT_OWNPAY_URL = "https://api.ownpay.dev"

class OwnPayClient:
    """
    Canonical OwnPay Python Client for Developers and AI Agents.
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = DEFAULT_OWNPAY_URL,
        timeout: int = 15
    ):
        if not api_key:
            raise ValueError("OwnPayClient requires an api_key (e.g. own_live_... or own_test_...)")

        self.api_key = api_key.strip()
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.is_sandbox = self.api_key.startswith("own_test_")

        self.intents = IntentsAPI(self)
        self.agents = AgentsAPI(self)
        self.x402 = X402API(self)

    def request(
        self,
        method: str,
        path: str,
        json_data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        url = f"{self.base_url}{path if path.startswith('/') else '/' + path}"

        req_headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "User-Agent": "OwnPay-Python-SDK/1.0",
        }
        if headers:
            req_headers.update(headers)

        body_bytes = None
        if json_data is not None:
            req_headers["Content-Type"] = "application/json"
            body_bytes = json.dumps(json_data).encode("utf-8")

        req = urllib.request.Request(
            url,
            data=body_bytes,
            headers=req_headers,
            method=method.upper()
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                content = response.read().decode("utf-8")
                try:
                    data = json.loads(content)
                    return data.get("data", data) if isinstance(data, dict) else data
                except Exception:
                    return {"raw": content, "status": response.status}
        except urllib.error.HTTPError as e:
            err_content = e.read().decode("utf-8")
            try:
                err_json = json.loads(err_content)
                msg = err_json.get("error") or err_json.get("message") or str(e)
            except Exception:
                msg = f"HTTP Error {e.code}: {e.reason}"
            raise RuntimeError(f"OwnPay API Error ({e.code}): {msg}") from e
        except urllib.error.URLError as e:
            raise ConnectionError(f"Failed to reach OwnPay API: {e.reason}") from e

    def create_intent(
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
        """Convenience method to create a payment intent across supported chains (Base, Solana, BSC, opBNB)."""
        return self.intents.create(
            order_id=order_id,
            amount=amount,
            currency=currency,
            title=title,
            webhook_url=webhook_url,
            metadata=metadata,
            chain=chain,
            asset=asset,
        )

