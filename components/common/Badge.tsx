import { ReactNode } from "react";

function getStyle(size: string, color: string, noDark?: boolean) {
  const sizeOptions: { [key: string]: string } = {
    default: "text-xs px-2 py-[1px] font-medium ",
    lg: "text-xs px-4 py-1 font-medium ",
  };
  const colorOptions: { [key: string]: string } = {
    white: "bg-white text-slate-600" + " " + (!noDark && "dark:bg-cyan-900 dark:text-slate-300"),
    orange: "bg-orange-500 text-white" + " " + (!noDark && "dark:bg-orange-500 dark:text-white"),
    red: "bg-red-500 text-white" + " " + (!noDark && "dark:bg-red-500 dark:text-white"),
    gray: "bg-slate-100 text-slate-600" + " " + (!noDark && "dark:bg-cyan-900 dark:text-slate-300"),
    green: "bg-green-400 text-green-900" + " " + (!noDark && "dark:bg-slate-950 dark:text-green-300"),
    dark: "bg-green-900 text-green-400" + " " + (!noDark && "dark:bg-green-400 dark:text-green-900"),
  };
  return sizeOptions[size] + colorOptions[color];
}

const Badge = ({
  children,
  size = "default",
  color,
  noDark = false,
}: {
  children: ReactNode;
  size?: "default" | "lg";
  color: "white" | "orange" | "red" | "gray" | "green" | "dark" | string;
  noDark?: boolean;
}) => {
  return <div className={"rounded-full " + " " + getStyle(size, color, noDark)}>{children}</div>;
};

export default Badge;
