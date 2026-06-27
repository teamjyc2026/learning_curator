import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-[background,color,box-shadow,transform] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // 핵심 CTA: 잉크(검정) 채움
        default: "bg-foreground text-background hover:bg-foreground/85",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        soft: "bg-primary-soft text-primary hover:bg-primary-soft/70",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 gap-1.5 rounded-md px-3 text-[0.8rem]",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-md",
        "icon-xs": "size-6 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Base UI/shadcn 호환: 전달된 엘리먼트(예: <Link/>)로 렌더링 */
    render?: React.ReactElement;
  };

function Button({
  className,
  variant,
  size,
  render,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (render && React.isValidElement(render)) {
    const el = render as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(
      el,
      {
        ...props,
        className: cn(classes, el.props.className as string | undefined),
      },
      children ?? (el.props.children as React.ReactNode),
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
