import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-black/10 bg-white px-3 py-1 text-sm text-[#151515] outline-none transition-colors placeholder:text-[#a3a8b0] focus-visible:border-[#1d7c68] focus-visible:ring-2 focus-visible:ring-[#1d7c68]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
