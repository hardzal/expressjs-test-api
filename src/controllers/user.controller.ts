import { NextFunction, Request, Response } from "express";
import userService from "../service/user.service";
import { prisma } from "../libs/prisma";

interface User {
  id: number;
  username: string;
  email: string;
}

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users: User[] = await userService.getUsers();
      console.log(users);
      res.json(
        JSON.parse(
          JSON.stringify(users, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
          )
        )
      );
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async transferMoney(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_sender, id_receiver, amount } = req.body;

      const result = await userService.transferUserMoney(
        id_sender,
        id_receiver,
        amount
      );

      res.json(
        JSON.parse(
          JSON.stringify(result, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
          )
        )
      );
    } catch (error) {
      res.status(500).json({
        message: "Error when transferred money",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async buyProducts(req: Request, res: Response, next: NextFunction) {
    /*
    request
      {
          "userId": number,
          "productId": number,
          "amount": number
      },


      response
        {
          "user": {},
          "product": {},
          "totalCost": number.
          "change": number,
        }
    */
    try {
      console.log(req.body);
      const { userId, productId, amount } = req.body;

      const result = await userService.buyProducts(userId, productId, amount);
      res.json(
        JSON.parse(
          JSON.stringify(result, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
          )
        )
      );
    } catch (error) {
      res.status(500).json({
        message: "Error when buy products",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new UserController();
