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
    return await prisma.$transaction(async (tx) => {
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
    });
  }
}

export default new userService();
