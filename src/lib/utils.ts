import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Splits a className into layout classes (width, flex, margins) for a wrapper
 * element and the rest for the field inside it.
 */
export function splitLayoutClasses(className?: string): { layout: string; field: string } {
  const layout: string[] = [];
  const field: string[] = [];
  for (const token of (className ?? "").split(/\s+/).filter(Boolean)) {
    const base = token.split(":").pop() ?? token;
    if (/^(w-|min-w-|max-w-|flex-|basis-|grow|shrink|mx-|ml-|mr-|self-)/.test(base)) layout.push(token);
    else field.push(token);
  }
  return { layout: layout.join(" "), field: field.join(" ") };
}
