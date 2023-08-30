import { cn } from "../../lib/styles";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bsa-animate-pulse bsa-rounded-md bsa-bg-muted", className)}
      role="figure"
      {...props}
    />
  );
}

export { Skeleton };
