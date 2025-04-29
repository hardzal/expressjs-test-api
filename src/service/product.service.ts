import { prisma } from "../libs/prisma";
import { Product } from "../types/product";

class ProductService {
  async getProductAll() {
    return await prisma.product.findMany();
  }

  async getProductsPage(total: number, post?: number) {
    return await prisma.product.findMany({
      take: total,
      ...(post && {
        skip: 1,
        cursor: {
          id: post,
        },
      }), // kode ... adalah spread digunakan untuk mengggunakan beberapa parameter
    });
  }

  async getProducts(total: number, position: number) {
    return await prisma.product.findMany({
      take: total,
      skip: position,
    });
  }

  async createProduct(data: Product) {
    const { userId, title, price } = data;
    return await prisma.product.create({
      data: {
        userId,
        title,
        price,
      },
    });
  }

  async getUserProduct(userId: number, urutBy: string) {
    // if (urutBy === "desc") {
    //   return await prisma.product.findMany({
    //     where: {
    //       OR: [{ userId: userId1 }, { userId: userId2 }],
    //     },
    //     orderBy: { title: "desc" },
    //   });
    // }

    // return await prisma.product.findMany({
    //   where: {
    //     OR: [{ userId: userId1 }, { userId: userId2 }],
    //   },
    //   orderBy: { title: "asc" },
    // });

    if (urutBy === "desc") {
      return await prisma.product.findMany({
        where: { userId },
        orderBy: { title: "desc" },
      });
    }

    return await prisma.product.findMany({
      where: { userId },
      orderBy: { title: "asc" },
    });
  }

  async getUserProducts(users: any, urutBy: string) {
    return await prisma.product.findMany({
      where: {
        userId: {
          in: users,
        },
      },
      orderBy: { title: urutBy === "asc" ? "asc" : "desc" },
    });
  }
}

export default new ProductService();
