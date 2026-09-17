import * as React from "react";
import * as T from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";
export const Tabs = T.Root;
export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <T.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-lg bg-muted p-1",
      className,
    )}
    {...props}
  />
));
export const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <T.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-secondary data-[state=active]:text-white",
      className,
    )}
    {...props}
  />
));
export const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <T.Content
    ref={ref}
    className={cn(
      "mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
