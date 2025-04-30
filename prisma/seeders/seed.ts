import { PrismaClient } from "@prisma/client";
import { datas } from "./product.seed";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.product.createManyAndReturn({
    data: datas,
  });

  // const userProducts = await prisma.user.create({
  //   data: {
  //     username: "user baru",
  //     email: "emailbaru2@gmail.com",
  //     product: {
  //       create: [
  //         {
  //           title: "title product",
  //           price: 5000,
  //         },
  //       ],
  //     },
  //   },
  // });

  // const userProducts = await prisma.user.upsert({
  //   where: { email: "emailbaru2@gmail.com" },
  //   update: {
  //     username: "user baru updated",
  //     email: "emailbaru10@gmail.com",
  //   },
  //   create: {
  //     product: {
  //       create: [
  //         {
  //           title: "new product",
  //           price: 30000,
  //         },
  //         {
  //           title: "new product 3",
  //           price: 5000,
  //         },
  //       ],
  //     },
  //     username: "user baru updated",
  //     email: "emailbaru2@gmail.com",
  //   },
  // });

  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
