import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-black/10 bg-white text-[#2b2b2b]",
        accent: "border-transparent bg-[var(--color-accent)]/15 text-[#0d6b57]",
        outline: "border-black/15 text-[#4f535c]",
        dark: "border-transparent bg-[#151515] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
