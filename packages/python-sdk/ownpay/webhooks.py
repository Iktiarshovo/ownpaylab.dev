import hmac
import hashlib
import time
from typing import Union

class OwnPayWebhook:
    """
    Cryptographic HMAC-SHA256 signature verification for OwnPay webhook events.
    """

    @staticmethod
    def verify_signature(
        raw_body: Union[str, bytes],
        signature: str,
        timestamp: Union[str, int],
        secret: str,
        tolerance_seconds: int = 300,
    ) -> bool:
        if not signature or not timestamp or not secret:
            return False

        try:
            now = int(time.time())
            ts_epoch = int(timestamp)
            if abs(now - ts_epoch) > tolerance_seconds:
                return False
        except (ValueError, TypeError):
            return False

        body_str = raw_body.decode("utf-8") if isinstance(raw_body, bytes) else str(raw_body)
        clean_sig = signature[3:] if signature.startswith("v1=") else signature

        # Verify standard v1:<timestamp>:<body_str>
        expected_colon = hmac.new(
            secret.encode("utf-8"),
            f"v1:{timestamp}:{body_str}".encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        # Verify alternate <timestamp>.<body_str>
        expected_dot = hmac.new(
            secret.encode("utf-8"),
            f"{timestamp}.{body_str}".encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(clean_sig, expected_colon) or hmac.compare_digest(clean_sig, expected_dot)
