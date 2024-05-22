import { Request, Response } from "express";
import z from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10}$/),
});
async function handleRequest(req: Request, res: Response) {
  const { success } = bodySchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid request body",
      message: "Bad request please check the inputs",
    });
  }
  const { email, phone } = req.body;

  
}

export default handleRequest;
