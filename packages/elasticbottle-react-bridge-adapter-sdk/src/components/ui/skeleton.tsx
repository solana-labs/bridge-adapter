import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bsa-animate-pulse bsa-rounded-md bsa-bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
