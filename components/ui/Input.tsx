import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

const fieldBase =
  "w-full rounded bg-bone-wash border border-sand-gray px-4 py-3 text-body-md text-on-surface placeholder:text-outline transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "min-h-[100px] resize-y", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, "appearance-none cursor-pointer", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-label-md text-on-surface-variant mb-2", className)} {...props}>
      {children}
    </label>
  );
}
