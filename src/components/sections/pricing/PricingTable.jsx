"use client";
import React, { useState } from "react";
import "./PricingTable.css"; // Optional: for custom styles

const plans = [
  {
    name: "BasicPack",
    description: "Made for starters",
    price: { INR: 699, SEK: 89 },
    features: [
      "Bandwidth: 50 GB",
      "Add-On Domains: 10",
      "SSD Storage: 250 GB",
      "Mail Addresses: 25",
      "Support: Only Mail"
    ],
    color: "var(--color-accent)"
  },
  {
    name: "ExtendedPack",
    description: "Made for experienced users",
    price: { INR: 899, SEK: 119 },
    features: [
      "Bandwidth: 150 GB",
      "Add-On Domains: 50",
      "SSD Storage: 500 GB",
      "Mail Addresses: 50",
      "Support: Mail/Phone"
    ],
    color: "var(--color-grey)"
  },
  {
    name: "ProsPack",
    description: "Made for professionals/agencies",
    price: { INR: 2499, SEK: 349 },
    features: [
      "Bandwidth: 250 GB",
      "Add-On Domains: 80",
      "SSD Storage: 1 TB",
      "Mail Addresses: 75",
      "Support: 7/24"
    ],
    color: "var(--color-brand)"
  }
];

const currencySymbols = { INR: '₹', SEK: 'kr' };

const PricingTable = () => {
  const [currency, setCurrency] = useState("INR");

  return (
    <section className="pricing-table-section w-full py-16 md:py-24 bg-gradient-to-b from-[var(--color-light)] to-[var(--color-grey)/10]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-brand)] mb-2 tracking-tight">Our Pricing Packages</h2>
          <div className="inline-flex rounded-full overflow-hidden border border-[var(--color-grey)] bg-[var(--color-light)] mt-4">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-8 py-2 font-semibold text-lg transition-colors duration-200 focus:outline-none ${currency === "INR" ? 'bg-[var(--color-accent)] text-[var(--color-brand)]' : 'bg-[var(--color-light)] text-[var(--color-grey)]'}`}
            >
              INR
            </button>
            <button
              onClick={() => setCurrency("SEK")}
              className={`px-8 py-2 font-semibold text-lg transition-colors duration-200 focus:outline-none ${currency === "SEK" ? 'bg-[var(--color-accent)] text-[var(--color-brand)]' : 'bg-[var(--color-light)] text-[var(--color-grey)]'}`}
            >
              SEK
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-10">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className="relative flex flex-col items-center bg-[var(--color-light)] rounded-2xl shadow-xl border border-[var(--color-grey)] pt-8 pb-8 px-6 md:px-8 transition-transform hover:-translate-y-2 hover:shadow-2xl duration-200"
              style={{ borderTop: `4px solid ${plan.color}`, minWidth: 260, maxWidth: 340 }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full" style={{ background: plan.color, opacity: 0.2 }} />
              <div className="font-bold text-lg mb-2 tracking-wide" style={{ color: plan.color }}>{plan.name}</div>
              <div className="text-[var(--color-grey)] text-base mb-4 text-center min-h-[40px]">{plan.description}</div>
              <div className="flex items-end mb-4">
                <span className="text-4xl md:text-5xl font-extrabold" style={{ color: plan.color }}>{currencySymbols[currency]}{plan.price[currency]}</span>
                <span className="ml-2 text-base text-[var(--color-grey)] font-medium">/month</span>
              </div>
              <ul className="w-full mb-6 space-y-3 text-[var(--color-brand)] text-base">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 pl-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: plan.color }}></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-auto bg-[var(--color-brand)] text-[var(--color-light)] font-bold rounded-lg px-8 py-3 text-lg shadow-md hover:bg-[var(--color-accent)] hover:text-[var(--color-brand)] transition-colors duration-200"
                style={{ border: `2px solid ${plan.color}` }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
