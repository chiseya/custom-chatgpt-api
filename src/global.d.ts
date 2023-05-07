import { Account } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: Account;
    }
  }
}
