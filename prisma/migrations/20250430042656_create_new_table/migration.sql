/*
  Warnings:

  - You are about to alter the column `amount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `cost` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cost" BIGINT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stock" INTEGER NOT NULL;
