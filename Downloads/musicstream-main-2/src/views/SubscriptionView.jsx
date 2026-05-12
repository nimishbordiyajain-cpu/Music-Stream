import { useState, useCallback } from "react";
import PricingPlanCard from "../components/PricingPlanCard";
import SubscriptionFAQ from "../components/SubscriptionFAQ";

const MONTHLY = { student: 49, individual: 99, family: 199 };
const yearlyTotal = (m) => Math.round(m * 12 * 0.8);
const yearlyPerMonth = (m) => Math.round(yearlyTotal(m) / 12);

export default function SubscriptionView({ onChoosePlan }) {
  const [isYearly, setIsYearly] = useState(false);

  const openPayment = useCallback(
    (planKey, title, monthlyINR) => {
      const amountLabel = isYearly
        ? `₹${yearlyPerMonth(monthlyINR)}/mo · ₹${yearlyTotal(monthlyINR).toLocaleString("en-IN")}/yr`
        : `₹${monthlyINR}/month`;
      onChoosePlan({ planKey, title, isYearly, amountLabel });
    },
    [isYearly, onChoosePlan],
  );

  return (
    <div className="view subscription-page">
      <header className="subscription-page__header">
        <h1 className="view__heading">Choose your plan</h1>
        <p className="subscription-page__lede">
          Unlock premium listening with transparent pricing. Yearly saves 20%.
        </p>

        <div className="billing-toggle" role="group" aria-label="Billing period">
          <button
            type="button"
            className={`billing-toggle__opt ${!isYearly ? "billing-toggle__opt--on" : ""}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`billing-toggle__opt ${isYearly ? "billing-toggle__opt--on" : ""}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly
            <span className="billing-toggle__save">−20%</span>
          </button>
        </div>
      </header>

      <div className="subscription-page__grid">
        <PricingPlanCard
          title="Student"
          badge="Age verified"
          popular={false}
          isYearly={isYearly}
          priceMonthly={MONTHLY.student}
          priceYearly={yearlyTotal(MONTHLY.student)}
          effectiveYearlyPerMonth={yearlyPerMonth(MONTHLY.student)}
          description="Verified students enjoy full access at a lower price with a focused feature set."
          features={[
            { included: true, label: "Standard quality streaming" },
            { included: true, label: "Age-verified student pricing" },
            { included: true, label: "Limited skips per hour" },
            { included: false, label: "Unlimited skips" },
            { included: false, label: "High quality / lossless" },
            { included: false, label: "Offline downloads" },
          ]}
          ctaLabel="Start Student plan"
          onOpenPayment={() => openPayment("student", "Student", MONTHLY.student)}
        />

        <PricingPlanCard
          title="Individual"
          badge={null}
          popular
          isYearly={isYearly}
          priceMonthly={MONTHLY.individual}
          priceYearly={yearlyTotal(MONTHLY.individual)}
          effectiveYearlyPerMonth={yearlyPerMonth(MONTHLY.individual)}
          description="The best balance for solo listeners who want full quality and freedom."
          features={[
            { included: true, label: "Unlimited skips" },
            { included: true, label: "High quality audio" },
            { included: true, label: "Offline downloads" },
            { included: true, label: "Personalized mixes & discovery" },
            { included: false, label: "Up to 6 family accounts" },
            { included: false, label: "Parental controls" },
          ]}
          ctaLabel="Get Individual"
          onOpenPayment={() => openPayment("individual", "Individual", MONTHLY.individual)}
        />

        <PricingPlanCard
          title="Family"
          badge={null}
          popular={false}
          isYearly={isYearly}
          priceMonthly={MONTHLY.family}
          priceYearly={yearlyTotal(MONTHLY.family)}
          effectiveYearlyPerMonth={yearlyPerMonth(MONTHLY.family)}
          description="Share the experience with up to six members under one subscription."
          features={[
            { included: true, label: "Up to 6 member accounts" },
            { included: true, label: "All Individual features" },
            { included: true, label: "Parental controls" },
            { included: true, label: "Unlimited skips (per account)" },
            { included: true, label: "High quality & offline" },
            { included: false, label: "Student-only pricing" },
          ]}
          ctaLabel="Get Family"
          onOpenPayment={() => openPayment("family", "Family", MONTHLY.family)}
        />
      </div>

      <SubscriptionFAQ />
    </div>
  );
}
