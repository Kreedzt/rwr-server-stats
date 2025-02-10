import React from "react";
import type { FC } from "react";
import { cn } from "../../ui/utils";

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
};

const Button: FC<ButtonProps> = ({ className, loading, ...otherProps }) => {
  const combineClassName = cn(
    "btn",
    className
  );

  return (
    <button
      disabled={loading}
      type="button"
      className={combineClassName}
      {...otherProps}
    />
  );
};

export default Button;
