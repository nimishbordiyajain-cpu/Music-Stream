export default function PricingPlanCard({
  title,
  badge,
  popular,
  isYearly,
  priceMonthly,
  priceYearly,
  effectiveYearlyPerMonth,
  description,
  features,
  ctaLabel,
  onOpenPayment,
}) {
  const displayMain = isYearly ? effectiveYearlyPerMonth : priceMonthly;
  const periodLabel = isYearly ? "/mo, billed yearly" : "/month";
  const yearlyNote = isYearly ? `₹${priceYearly.toLocaleString("en-IN")}/year · Save 20%` : null;

  return (
    <article
      className={`pricing-card glass-card pricing-card--clickable ${popular ? "pricing-card--popular" : ""}`}
      onClick={open}
    >
      {popular && (
        <div className="pricing-card__ribbon" aria-hidden>
          Most Popular
        </div>
      )}
      {badge && (
        <div
          className={`pricing-card__badge ${popular ? "pricing-card__badge--on-popular" : ""}`}
        >
          {badge}
        </div>
      )}

      <h2 className="pricing-card__title">{title}</h2>
      <p className="pricing-card__desc">{description}</p>

      <div className="pricing-card__price-block">
        <div className="pricing-card__price">
          <span className="pricing-card__currency">₹</span>
          <span className="pricing-card__amount">{displayMain}</span>
          <span className="pricing-card__period">{periodLabel}</span>
        </div>
        {isYearly && (
          <p className="pricing-card__yearly-hint">{yearlyNote}</p>
        )}
        {!isYearly && (
          <p className="pricing-card__yearly-hint pricing-card__yearly-hint--muted">
            Save 20% with yearly billing
          </p>
        )}
      </div>

      <ul className="pricing-card__features">
        {features.map((f) => (
          <li
            key={f.label}
            className={`pricing-card__feature ${f.included ? "pricing-card__feature--yes" : "pricing-card__feature--no"}`}
          >
            <span className="pricing-card__tick" aria-hidden>
              {f.included ? "✓" : "✗"}
            </span>
            {f.label}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`pricing-card__cta ${popular ? "pricing-card__cta--accent" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        {ctaLabel}
      </button>
    </article>
  );
}
