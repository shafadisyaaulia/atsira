export * from "./farmers";
export * from "./products";
export * from "./ecosystem";

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateID(dateStr: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function gradeColor(grade: string): { bg: string; text: string } {
  switch (grade) {
    case "Premium":
      return { bg: "bg-secondary-container", text: "text-on-secondary-container" };
    case "Standard":
      return { bg: "bg-primary-fixed", text: "text-on-primary-fixed-variant" };
    case "Economy":
      return { bg: "bg-surface-container-high", text: "text-on-surface-variant" };
    default:
      return { bg: "bg-error-container", text: "text-on-error-container" };
  }
}
