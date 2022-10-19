import { NextFunction, Request, Response } from 'express';

export function middleware(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    next();
  } else {
    res.send({ message: 'user not logged in' });
  }
}

export function middlewareHome(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    res.send({ message: 'user not logged in' });
  } else {
    next();
  }
}
