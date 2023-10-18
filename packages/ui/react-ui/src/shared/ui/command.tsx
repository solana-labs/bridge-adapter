"use client";
import * as React from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { cn } from "../lib/styles";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";

const CLS = {
  CommandOuter: `bsa-flex bsa-h-full bsa-w-full bsa-flex-col bsa-overflow-hidden bsa-rounded-md bsa-bg-popover bsa-text-popover-foreground`,
};

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      //"bsa-flex bsa-h-full bsa-w-full bsa-flex-col bsa-overflow-hidden bsa-rounded-md bsa-bg-popover bsa-text-popover-foreground",
      CLS.CommandOuter,
      className,
    )}
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps;

// FIXME: might not be needed
const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className={`bsa-overflow-hidden bsa-p-0 bsa-shadow-lg`}>
        <Command className="[&_[cmdk-group-heading]]:bsa-px-2 [&_[cmdk-group-heading]]:bsa-font-medium [&_[cmdk-group-heading]]:bsa-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:bsa-pt-0 [&_[cmdk-group]]:bsa-px-2 [&_[cmdk-input-wrapper]_svg]:bsa-h-5 [&_[cmdk-input-wrapper]_svg]:bsa-w-5 [&_[cmdk-input]]:bsa-h-12 [&_[cmdk-item]]:bsa-px-2 [&_[cmdk-item]]:bsa-py-3 [&_[cmdk-item]_svg]:bsa-h-5 [&_[cmdk-item]_svg]:bsa-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className={"bsa-flex bsa-items-center bsa-border-b bsa-px-3"}
    cmdk-input-wrapper=""
  >
    <Search
      className={"bsa-mr-2 bsa-h-4 bsa-w-4 bsa-shrink-0 bsa-opacity-50"}
    />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "bsa-flex bsa-h-11 bsa-w-full bsa-rounded-md bsa-bg-transparent bsa-py-3 bsa-text-sm bsa-outline-none placeholder:bsa-text-muted-foreground disabled:bsa-cursor-not-allowed disabled:bsa-opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "bsa-max-h-[300px] bsa-overflow-y-auto bsa-overflow-x-hidden",
      className,
    )}
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
CommandList.displayName = CommandPrimitive.List.displayName;

// FIXME: might not be needed
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="bsa-py-6 bsa-text-center bsa-text-sm"
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "bsa-overflow-hidden bsa-p-1 bsa-text-foreground [&_[cmdk-group-heading]]:bsa-px-2 [&_[cmdk-group-heading]]:bsa-py-1.5 [&_[cmdk-group-heading]]:bsa-text-xs [&_[cmdk-group-heading]]:bsa-font-medium [&_[cmdk-group-heading]]:bsa-text-muted-foreground",
      className,
    )}
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("bsa-mx-1 bsa-h-px bsa-bg-border", className)}
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "bsa-relative bsa-flex bsa-cursor-default bsa-select-none bsa-items-center bsa-rounded-sm bsa-px-2 bsa-py-1.5 bsa-text-sm bsa-outline-none aria-selected:bsa-bg-accent aria-selected:bsa-text-accent-foreground data-[disabled]:bsa-pointer-events-none data-[disabled]:bsa-opacity-50",
      className,
    )}
    {...props}
  />
));
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "bsa-ml-auto bsa-text-xs bsa-tracking-widest bsa-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
