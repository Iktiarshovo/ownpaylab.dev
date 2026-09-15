# React & Vite Integration

Embed the OwnPay checkout modal inside React applications using our lightweight frontend library.

---

## Installation

```bash
npm install @ownpay/checkout-react
```

---

## Example Component

```tsx
import React, { useState } from 'react';
import { OwnPayButton, useOwnPayModal } from '@ownpay/checkout-react';

export function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const { openModal } = useOwnPayModal();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Fetch clientSecret from your backend
      const res = await fetch('/api/create-intent', { method: 'POST' });
      const { clientSecret } = await res.json();

      // 2. Open reactive checkout modal
      openModal({
        clientSecret,
        onSuccess: (payment) => {
          console.log('Payment settled:', payment.txHash);
          window.location.href = '/success';
        },
        onError: (err) => {
          alert('Payment failed: ' + err.message);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Complete Your Purchase</h2>
      <OwnPayButton onClick={handleCheckout} loading={loading}>
        Pay with Web3 (Zero Gas)
      </OwnPayButton>
    </div>
  );
}
```
