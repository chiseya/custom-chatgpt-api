import { Request, Response } from 'express';

/**
 * @api {get} /verify Verify authentication token
 * @apiName GetVerify
 * @apiGroup Verify
 *
 * @apiSuccess (200) {String} message ok
 */
export function handleGetVerify(req: Request, res: Response) {
  // Middleware will have already verified the token
  res.json({ message: 'ok' });
}
