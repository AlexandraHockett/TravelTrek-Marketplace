// File: components/customer/index.ts
// Location: Create this file in the components/customer/ directory

// Main components
export { default as TourCard } from "./TourCard";
export { default as BookingForm } from "./BookingForm";
export { default as BookingList } from "./BookingList";
export {
  default as PaymentButton,
  QuickPayment,
  CompleteBookingPayment,
  InstantBookingPayment,
} from "./PaymentButton";

// Type definitions for component props
export type { default as TourCardProps } from "./TourCard";
export type { default as BookingFormProps } from "./BookingForm";
export type { default as BookingListProps } from "./BookingList";
export type { default as PaymentButtonProps } from "./PaymentButton";
