import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
const variants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        secondary: "border-transparent bg-secondary",
        outline: "border-border text-[#aaaaaa]",
      },
    },
    defaultVariants: { variant: "outline" },
  },
);
export function Badge({ className, variant, ...props }) {
  return <span className={cn(variants({ variant }), className)} {...props} />;
}
