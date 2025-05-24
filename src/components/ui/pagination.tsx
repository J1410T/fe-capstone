<<<<<<< HEAD
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
=======
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
<<<<<<< HEAD
);
Pagination.displayName = "Pagination";
=======
)
Pagination.displayName = "Pagination"
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
<<<<<<< HEAD
));
PaginationContent.displayName = "PaginationContent";
=======
))
PaginationContent.displayName = "PaginationContent"
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
<<<<<<< HEAD
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;
=======
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
<<<<<<< HEAD
);
PaginationLink.displayName = "PaginationLink";
=======
)
PaginationLink.displayName = "PaginationLink"
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
<<<<<<< HEAD
    className={cn("gap-1 pl-2.5", className)}
    {...props}
    size="default"
=======
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
<<<<<<< HEAD
);
PaginationPrevious.displayName = "PaginationPrevious";
=======
)
PaginationPrevious.displayName = "PaginationPrevious"
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
<<<<<<< HEAD
    className={cn("gap-1 pr-2.5", className)}
    {...props}
    size="default"
=======
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
<<<<<<< HEAD
);
PaginationNext.displayName = "PaginationNext";
=======
)
PaginationNext.displayName = "PaginationNext"
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
<<<<<<< HEAD
);
PaginationEllipsis.displayName = "PaginationEllipsis";
=======
)
PaginationEllipsis.displayName = "PaginationEllipsis"
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
<<<<<<< HEAD
};
=======
}
>>>>>>> ec4c6af56fd61ae8fcc44cb1774445895a6dd781
