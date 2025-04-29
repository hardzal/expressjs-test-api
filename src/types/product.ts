import { Decimal } from "@prisma/client/runtime/library";

export interface Product {
  id: number;
  userId: number;
  title: string;
  price: Decimal;

  createdAt: Date;
  updatedAt: Date | null;
}
