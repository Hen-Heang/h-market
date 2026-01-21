"use client";

import { useEffect, useMemo, useRef } from "react";

export default function OtpInput({
  length = 4,
  value,
  onChange,
}: {
  length?: number;
  value: string;
  onChange: (val: string) => void;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const chars = useMemo(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    return arr;
  }, [value, length]);

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
  }, [length]);

  const setAll = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, length).split("");
    const next = Array.from({ length }, (_, i) => digits[i] ?? "");
    onChange(next.join(""));

    const focusIdx = Math.min(digits.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const setAt = (idx: number, ch: string) => {
    const next = chars.slice();
    next[idx] = ch;
    onChange(next.join(""));
  };

  return (
    <div className="flex gap-4">
      {chars.map((ch, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={length}
          value={ch}
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          aria-label={`OTP digit ${idx + 1}`}
          onFocus={(e) => e.currentTarget.select()}
          onPaste={(e) => {
            e.preventDefault();
            setAll(e.clipboardData.getData("text"));
          }}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw.length > 1) {
              setAll(raw);
              return;
            }

            const v = raw.replace(/\D/g, "").slice(0, 1);
            setAt(idx, v);
            if (v && idx < length - 1) inputsRef.current[idx + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              if (chars[idx]) {
                setAt(idx, "");
                return;
              }
              if (idx > 0) inputsRef.current[idx - 1]?.focus();
            }

            if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
            if (e.key === "ArrowRight" && idx < length - 1) inputsRef.current[idx + 1]?.focus();
          }}
          className="h-14 w-14 rounded-lg border border-zinc-200 text-center text-xl font-semibold text-zinc-800 shadow-sm outline-none transition
                     focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/50
                     hover:border-zinc-300"
        />
      ))}
    </div>
  );
}
