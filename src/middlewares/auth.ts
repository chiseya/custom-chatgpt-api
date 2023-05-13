import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { findOrCreateAccount } from '../services/account/findOrCreateAccount';

export async function requiresAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401);
    return next(new Error('Please sign in to continue'));
  }

  const oAuth2Client = new OAuth2Client();
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.email_verified) {
      res.status(403);
      return next(new Error('You need to verify your email address'));
    }

    if (
      process.env.GSUITE_DOMAIN &&
      payload?.hd !== process.env.GSUITE_DOMAIN
    ) {
      res.status(403);
      return next(
        new Error('Your google account is not authorized to use this app'),
      );
    }

    req.user = await findOrCreateAccount({
      email: payload.email,
      name: payload.name ?? payload.email.split('@')[0],
      picture: payload.picture ?? null,
    });

    next();
  } catch {
    res.status(401);
    next(new Error('Your session has expired'));
  }
}
