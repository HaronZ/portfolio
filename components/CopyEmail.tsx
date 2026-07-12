"use client";

import { useRef, useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (old browser / no permission) — fall back to mail app
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button className="btn btn-ghost" type="button" onClick={copy}>
      {copied ? "Copied ✓" : email}
    </button>
  );
}
