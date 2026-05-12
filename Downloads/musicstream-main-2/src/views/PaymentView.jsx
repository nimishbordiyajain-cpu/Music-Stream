import { useState } from "react";
import Icon, { Icons } from "../components/Icon";

const TIER_BY_PLAN = {
  student: "student",
  individual: "individual",
  family: "family",
};

export default function PaymentView({
  planKey,
  planTitle,
  isYearly,
  amountLabel,
  onBack,
  onPaid,
}) {
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [busy, setBusy] = useState(false);

  const pay = (e) => {
    e.preventDefault();
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onPaid(TIER_BY_PLAN[planKey] || "individual");
    }, 650);
  };

  return (
    <div className="view payment-view">
      <button type="button" className="payment-back back-btn" onClick={onBack}>
        ← Back to plans
      </button>

      <div className="payment-layout">
        <section className="payment-summary glass-card">
          <h1 className="view__heading payment-view__title">Checkout</h1>
          <p className="payment-view__plan-name">{planTitle}</p>
          <p className="payment-view__billing">
            {isYearly ? "Billed yearly (20% off)" : "Billed monthly"}
          </p>
          <div className="payment-view__amount">{amountLabel}</div>
          <p className="muted payment-view__note">
            Demo checkout — no real charge. Card details are not sent anywhere.
          </p>
        </section>

        <section className="payment-form-wrap glass-card">
          <h2 className="payment-form__heading">Payment method</h2>
          <form className="payment-form" onSubmit={pay}>
            <label className="login-field">
              <span className="login-field__label">Name on card</span>
              <input
                className="login-field__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As on your card"
                autoComplete="cc-name"
              />
            </label>
            <label className="login-field">
              <span className="login-field__label">Card number</span>
              <input
                className="login-field__input"
                value={card}
                onChange={(e) => setCard(e.target.value.replace(/\D/g, "").slice(0, 16))}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                autoComplete="cc-number"
              />
            </label>
            <div className="payment-form__row">
              <label className="login-field payment-form__half">
                <span className="login-field__label">Expiry</span>
                <input
                  className="login-field__input"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                />
              </label>
              <label className="login-field payment-form__half">
                <span className="login-field__label">CVV</span>
                <input
                  className="login-field__input"
                  placeholder="123"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
              </label>
            </div>
            <button
              type="submit"
              className="btn-primary payment-form__submit"
              disabled={busy}
            >
              <Icon d={Icons.lock} size={16} />
              {busy ? "Processing…" : "Pay & subscribe"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
