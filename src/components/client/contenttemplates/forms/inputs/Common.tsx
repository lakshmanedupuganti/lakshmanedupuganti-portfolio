"use client";

import { csx } from "@src/lib/utility/stylings/classes";
import css from "./Common.module.scss";
import React, { forwardRef } from "react";
import { parse } from "date-fns";

export const InputLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  return (
    <div className={`inputLabelSelector ${css.inputLabel}`} {...rest}>
      {children}
    </div>
  );
};

export const CheckboxLabel: React.FC<
  React.HTMLAttributes<HTMLLabelElement> & { htmlFor?: string }
> = ({ children, ...rest }) => {
  return (
    <label className={css.checkboxLabel} {...rest}>
      {children}
    </label>
  );
};

interface InputContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  error: boolean;
  onDarkBg?: boolean;
  hideLabelOnFocus?: boolean;
}

export const InputContainer = forwardRef<HTMLDivElement, InputContainerProps>(
  ({ children, error, onDarkBg, hideLabelOnFocus, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`inputContainerSelector ${csx(css, "inputContainer", {
          error,
          onDarkBg,
          hideLabelOnFocus,
        })}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

InputContainer.displayName = "InputContainer";

export const InputError: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  return (
    <div className={css.inputError} {...rest}>
      {children}
    </div>
  );
};

export const SUPPORTED_FORMATS = [
  "MM/dd/yyyy",
  "M/d/yyyy",
  "MM-dd-yyyy",
  "M-d-yyyy",
  "dd/MM/yyyy",
  "d/M/yyyy",
  "dd-MM-yyyy",
  "d-M-yyyy",
  "yyyy-MM-dd",
  "yyyy/MM/dd",
  "MMMM dd, yyyy",
  "MMM dd, yyyy",
  "MMM d, yyyy",
  "dd MMMM yyyy",
  "d MMMM yyyy",
  "dd MMM yyyy",
  "d MMM yyyy",
  "MM/dd/yy",
  "M/d/yy",
  "dd/MM/yy",
  "d/M/yy",
  "MM-dd-yy",
  "M-d-yy",
  "dd-MM-yy",
  "d-M-yy",
  "yyyy/MM/dd",
  "yyyy-MM-dd",
  "MMM dd",
  "MMMM dd",
  "dd MMM",
  "d MMM",
  "dd MMMM",
  "d MMMM",
  "MMMM",
  "MMM",
  "MM",
  "M",
  "dd",
  "d",
  "yyyy",
  "yy",
];

export const parseDateFromString = (str: string | Date, pattern: string): Date | null => {
  if (!str) return null;

  if (str instanceof Date && !isNaN(str.getTime())) {
    return str;
  } 

  if (typeof str !== "string") return null;

  const trimmedStr = str.trim();
  const jsDate = new Date(trimmedStr);
  if (!isNaN(jsDate.getTime()) && jsDate.getFullYear() > 1900) {
    return jsDate;
  }

  for (const fmt of [pattern, ...SUPPORTED_FORMATS]) {
    try {
      const parsed = parse(trimmedStr, fmt, new Date());
      if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 1900) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  const commonPatterns = [
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/,
    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
    /^(\d{1,2})\s+(\d{1,2})\s+(\d{2,4})$/,
  ];

  for (const pattern of commonPatterns) {
    const match = trimmedStr.match(pattern);
    if (match) {
      try {
        const [, part1, part2, part3] = match;
        let year, month, day;
        
        if (part3.length === 4) {
          if (part1.length === 4) {
            year = parseInt(part1);
            month = parseInt(part2) - 1;
            day = parseInt(part3);
          } else {
            year = parseInt(part3);
            month = parseInt(part1) - 1;
            day = parseInt(part2);
          }
        } else {
          year = parseInt(part3) + (parseInt(part3) < 50 ? 2000 : 1900);
          month = parseInt(part1) - 1;
          day = parseInt(part2);
        }
        
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
          return date;
        }
      } catch {
        continue;
      }
    }
  }

  // Try to handle partial dates for real-time calendar updates
  const partialDatePatterns = [
    // Month names (full and abbreviated)
    /^(january|february|march|april|may|june|july|august|september|october|november|december)$/i,
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)$/i,
    // Month numbers
    /^(\d{1,2})$/,
    // Day + Month
    /^(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)$/i,
    /^(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)$/i,
    // Month + Year
    /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})$/i,
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})$/i,
  ];

  for (const pattern of partialDatePatterns) {
    const match = trimmedStr.match(pattern);
    if (match) {
      try {
        const currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        let day = currentDate.getDate();

        if (pattern.source.includes('january|february')) {
          const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                            'july', 'august', 'september', 'october', 'november', 'december'];
          const monthIndex = monthNames.findIndex(name => 
            name.toLowerCase() === match[1].toLowerCase()
          );
          if (monthIndex !== -1) {
            month = monthIndex;
            return new Date(year, month, 1);
          }
        } else if (pattern.source.includes('jan|feb')) {
          const monthAbbrs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                             'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const monthIndex = monthAbbrs.findIndex(abbr => 
            abbr.toLowerCase() === match[1].toLowerCase()
          );
          if (monthIndex !== -1) {
            month = monthIndex;
            return new Date(year, month, 1);
          }
        } else if (pattern.source.includes('\\d{1,2}')) {
          const num = parseInt(match[1]);
          if (num >= 1 && num <= 12) {
            // Likely a month
            month = num - 1;
            return new Date(year, month, 1);
          } else if (num >= 1 && num <= 31) {
            day = num;
            return new Date(year, month, day);
          }
        }
      } catch {
        continue;
      }
    }
  }

  return null;
};
