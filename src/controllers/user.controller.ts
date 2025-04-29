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
      res.json(users);
    } catch (error) {
      res.json(error);
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
}

export default new UserController();
