import { useEffect } from "react";

export default function PaymentSuccess() {
  useEffect(() => {
    const today = new Date().toISOString();
    localStorage.setItem("lastPayment", today);
    localStorage.setItem("isPaid", "true");
  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>Ödeme Başarılı!</h1>
      <p>Artık müzik paneline erişebilirsiniz.</p>
      <a href="/">Panele dön</a>
    </div>
  );
}
