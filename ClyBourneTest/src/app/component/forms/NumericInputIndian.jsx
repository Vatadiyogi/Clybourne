"use client";
import { useState, useEffect } from "react";
import { formatNumberIndian, parseIndianNumber } from "../../../utils/utility";

/**
 * Number input that shows Indian comma format when blurred (10,000 / 10,00,000).
 * Uses utility only – no external package. Form state still stores plain number string.
 */
export default function NumericInputIndian({
  value,
  onChange,
  name,
  placeholder = "0",
  disabled = false,
  className = "",
  allowNegative = false,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const rawValue = value === "" || value === null || value === undefined ? "" : String(value);
  const displayFormatted = formatNumberIndian(value);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(displayFormatted);
    }
  }, [isFocused, displayFormatted]);

  const handleFocus = () => {
    setIsFocused(true);
    setInputValue(parseIndianNumber(rawValue) || "");
  };

  const handleBlur = (e) => {
    const stripped = parseIndianNumber(e.target.value);
    const num = stripped === "" ? "" : (allowNegative ? parseFloat(stripped) : Math.abs(parseFloat(stripped) || 0));
    const toStore = num === "" ? "" : (typeof num === "number" ? String(num) : num);
    if (onChange) {
      onChange({ target: { name, value: toStore } });
    }
    setInputValue(formatNumberIndian(toStore));
    setIsFocused(false);
  };

  const handleChange = (e) => {
    const raw = parseIndianNumber(e.target.value);
    if (!allowNegative && raw.startsWith("-")) return;
    setInputValue(raw);
    const num = raw === "" ? "" : parseFloat(raw);
    const toStore = raw === "" ? "" : (isNaN(num) ? raw : String(num));
    if (onChange) {
      onChange({ target: { name, value: toStore } });
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      name={name}
      value={isFocused ? inputValue : (value === "" || value === null || value === undefined ? "" : formatNumberIndian(value))}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...rest}
    />
  );
}
