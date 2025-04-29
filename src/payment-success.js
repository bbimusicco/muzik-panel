import { useEffect } from 'react';

export default function PaymentSuccess() {
  useEffect(() => {
    localStorage.setItem('paymentInfo', JSON.stringify({ date: new Date() }));
  }, []);

  return (
    <div className="payment-success">
      <h1>✅ Ödemeniz başarıyla alındı!</h1>
      <p>Artık müzik panelini kullanabilirsiniz.</p>
      <a href="/">Anasayfaya Dön</a>
    </div>
  );
}
