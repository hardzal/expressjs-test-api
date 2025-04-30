import { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";

class userService {
  async getUsers() {
    return await prisma.user.findMany();
  }

  async getUser(userId: number) {
    return await prisma.user.findFirst({
      where: { id: userId },
    });
  }

  async transferUserMoney(from: number, to: number, amount: number) {
    return await prisma.$transaction(
      async (tx) => {
        const check = await tx.user.findFirst({
          where: { id: from },
        });

        if (check && check?.balance <= 0) {
          throw new Error(
            `User sender can't send money. Doesnt have enough money`
          );
        }

        const sender = await tx.user.update({
          data: {
            balance: {
              decrement: amount,
            },
          },
          where: {
            id: from,
          },
        });

        if (sender.balance < 0) {
          throw new Error(
            `UserId: ${from} doesn't have enough to send ${amount}`
          );
        }

        const recipient = await tx.user.update({
          data: {
            balance: {
              increment: amount,
            },
          },
          where: {
            id: to,
          },
        });

        return recipient;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      }
    );
  }

  async buyProducts(userId: number, productId: number, amount: number) {
    return await prisma.$transaction(
      async (tx) => {
        const check = await tx.user.findFirst({
          where: { id: userId },
        });

        if (check && check?.balance <= 0) {
          throw new Error(
            `User sender can't buy money. Doesnt have enough money`
          );
        }

        const product = await tx.product.findFirst({
          where: { id: productId },
        });
        const price = product && product.price ? Number(product.price) : 0;

        if (price === 0) {
          throw new Error(`Product doesnt have price`);
        }

        const totalPrice: number = amount * price;

        const productStock = await tx.product.update({
          data: {
            stock: {
              decrement: amount,
            },
          },
          where: {
            id: productId,
          },
        });

        if (productStock && productStock.stock < 0) {
          throw new Error(`Not enough product`);
        }

        const userBalance = await tx.user.update({
          data: {
            balance: {
              decrement: totalPrice,
            },
          },
          where: {
            id: userId,
          },
        });

        if (userBalance.balance < 0) {
          throw new Error(`Doesnt have enough money.`);
        }

        const order = await tx.order.create({
          data: {
            productId,
            userId,
            amount,
            cost: totalPrice,
          },
          include: { user: true, product: true },
        });

        return order;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      }
    );
  }
}

export default new userService();
