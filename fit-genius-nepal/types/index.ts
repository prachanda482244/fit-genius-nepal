// src/types/index.ts
export type User = {
  id: string;
  name?: string;
  email?: string;
  // add more fields from your backend
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "buy" | "rent";
  rentalPeriod?: number; // in days
};
