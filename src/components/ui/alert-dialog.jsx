import * as React from "react";
import * as P from "@radix-ui/react-alert-dialog";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";
export const AlertDialog = P.Root,
  AlertDialogTrigger = P.Trigger,
  AlertDialogTitle = P.Title,
  AlertDialogDescription = P.Description;
export const AlertDialogContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <P.Portal>
      <P.Overlay className="fixed inset-0 z-50 bg-black/80" />
      <P.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 rounded-xl border border-border bg-background p-6 shadow-lg",
          className,
        )}
        {...props}
      />
    </P.Portal>
  ),
);
export const AlertDialogAction = React.forwardRef(
  ({ className, ...props }, ref) => (
    <P.Action
      ref={ref}
      className={cn(buttonVariants({ variant: "destructive" }), className)}
      {...props}
    />
  ),
);
export const AlertDialogCancel = React.forwardRef(
  ({ className, ...props }, ref) => (
    <P.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  ),
);
AlertDialogContent.displayName = "AlertDialogContent";
AlertDialogAction.displayName = "AlertDialogAction";
AlertDialogCancel.displayName = "AlertDialogCancel";
