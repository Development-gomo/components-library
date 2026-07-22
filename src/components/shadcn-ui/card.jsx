import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-md border border-black/10 bg-white text-[#151515] shadow-[0_1px_0_rgba(0,0,0,0.04)]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-sm font-semibold leading-none", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-xs text-[#8a8f99]", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
