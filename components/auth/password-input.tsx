"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

type PasswordInputProps = {
  label: string;
  name: string;
  placeholder: string;
  minLength?: number;
  required?: boolean;
};

export function PasswordInput({
  label,
  name,
  placeholder,
  minLength,
  required,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <input
          className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-11 text-sm outline-none transition focus:border-foreground"
          id={id}
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          required={required}
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
          onClick={() => setVisible((value) => !value)}
          type="button"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}
