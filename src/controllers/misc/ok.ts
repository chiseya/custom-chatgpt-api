import { Request, Response } from 'express';

export function ok(req: Request, res: Response) {
  res.json({ message: 'ok' });
}
