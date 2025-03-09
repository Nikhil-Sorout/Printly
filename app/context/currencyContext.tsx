// context/CurrencyContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";

type Currency = "USD" | "INR" | "EUR"; // Add more as needed

interface CurrencyContextType {
  currency: Currency;
  currencySymbol: string;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number, fromCurrency?: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const exchangeRates: Record<Currency, number> = {
  USD: 1, // Base currency
  INR: 83, // 1 USD = 83 INR
  EUR: 0.92, // 1 USD = 0.92 EUR
};
const currencySymbols = {
    USD: '$',
    EUR: '€',
    INR: '₹',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>("INR");
  const currencySymbol = currencySymbols[currency] ||  '₹';

  const convertAmount = (amount: number, fromCurrency: Currency = "INR") => {
    if (fromCurrency === currency) return amount; // No conversion needed
    const inUSD = amount / exchangeRates[fromCurrency]; // Convert to USD
    return inUSD * exchangeRates[currency]; // Convert to target currency
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol, setCurrency, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
