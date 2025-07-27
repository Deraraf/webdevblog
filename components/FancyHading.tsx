import { cn } from "@/lib/utils";
import React from "react";

const FancyHading = ({
  variant,
  title,
}: {
  title: string;
  variant: string;
}) => {
  function getVariant(variant: string) {
    switch (variant) {
      case "primary":
        return "bg-blue-500 w- text-white w-[50px]";
      case "secondary":
        return "bg-green-500 text-white";
      case "tertiary":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  }

  return <h1 className={cn(getVariant(variant))}>{title}</h1>;
};

export default FancyHading;
