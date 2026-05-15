import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={twMerge(
        "rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      {...props}
      className={twMerge(
        "rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur",
        className,
      )}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={twMerge(
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-slate-900/10 focus:ring-4",
        props.className,
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={twMerge(
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-slate-900/10 focus:ring-4",
        props.className,
      )}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}
