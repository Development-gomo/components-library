import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#1d7c68]/40",
  {
    variants: {
      variant: {
        default: "bg-[#151515] text-white hover:bg-[#151515]/90",
        accent: "bg-[var(--color-accent)] text-black hover:opacity-90",
        outline: "border border-black/10 bg-white text-[#151515] hover:border-[#1d7c68] hover:text-[#1d7c68]",
        ghost: "text-[#4f535c] hover:bg-black/[0.04] hover:text-[#151515]",
        link: "text-[#1d7c68] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
