import { Request, Response } from "express";
import productService from "../service/product.service";
import { Product } from "../types/product";

class ProductController {
  async getProductPage(req: Request, res: Response) {
    try {
      const { limit, id } = req.query;
      if (id === undefined) {
        const totalProduct = await productService.getProductAll();
        res.json(totalProduct);
        return;
      }

      const idNum = Number(id);
      if (isNaN(idNum)) {
        res.status(400).json({ message: "Invalid Id parameter" });
        return;
      }

      const limitNum = Number(limit);
      if (isNaN(limitNum)) {
        res.status(400).json({ message: "Invalid limit parameter" });
        return;
      }

      const products = await productService.getProductsPage(limitNum, idNum);
      res.json({
        data: products,
        lastCursor: products[products.length - 1].id,
      });
      return;
    } catch (error) {
      res.json(error);
    }
  }
  async getProducts(req: Request, res: Response) {
    try {
      let { page } = req.query;
      const newPage = page !== undefined ? Number(page) : 1;
      const totalProduct = await productService.getProductAll();
      const total = page === undefined ? totalProduct.length : 3;
      let skip = 0;

      if (total === totalProduct.length) {
        res.json(totalProduct);
        return;
      }

      if (newPage > 1) {
        skip = total * (newPage - 1);
      }

      const products = await productService.getProducts(total, skip);
      res.json(products);
    } catch (error) {
      res.json(error);
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const { userId, title, price }: Product = req.body;
      const messages = [];

      if (typeof title !== "string") {
        messages.push("Title not a string.");
      }

      if (title.length < 3) {
        messages.push("Title length too short minimum 3 character.");
      }

      if (typeof price !== "number" || !Number.isInteger(price)) {
        messages.push("Price not a number or decimal.");
      }

      if (messages.length > 0) {
        res.json({
          messages: "Failed to add new product",
          errors: messages,
        });
        return;
      }

      const product = await productService.createProduct(req.body);
      res.json({
        messages: "Succes created product.",
        data: product,
      });
    } catch (error) {
      res.json(error);
    }
  }

  async getUserProducts(req: Request, res: Response) {
    try {
      const { orderBy, sortBy, users } = req.query;

      if (users?.length == 0) {
        res.json({
          message: "Query key user not found",
        });
        return;
      }

      const userArr = Array.isArray(users) ? users : [users];

      // cara1
      // const userProducts = await Promise.all(
      //   userArr?.map(async (user: any) => {
      //     const newUserProducts = await productService.getUserProduct(
      //       Number(user),
      //       orderBy?.toString() as string
      //     );

      //     return newUserProducts;
      //   })
      // );

      // cara 2 (select WHERE IN)
      const newUser = (users as string[]).map((n) => Number(n));
      const userProducts = await productService.getUserProducts(
        newUser,
        orderBy?.toString() as string
      );

      if (sortBy === "asc") {
        const newUserProducts = userProducts
          .flat(1)
          .sort((dataA, dataB) => dataA.title.localeCompare(dataB.title));
        res.json(newUserProducts);
        return;
      } else if (sortBy === "desc") {
        const newUserProducts = userProducts
          .flat(1)
          .sort((dataA, dataB) => dataB.title.localeCompare(dataA.title));
        res.json(newUserProducts);
        return;
      }

      res.json({
        message: "data tidak ada",
      });
    } catch (error) {
      res.json(error);
    }
  }
}

export default new ProductController();
