import { z, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';

export const validate = (schema: z.ZodSchema) => (req:Request, res:Response, next:NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }); 

      next();
    } catch (error) {
      console.log(error);
      
      if (error instanceof ZodError) {
        throw new AppError("Validation error", 400, {
          errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          })),
        });
      }

      throw error;
    }
}