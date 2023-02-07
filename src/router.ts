import { Router, Request, Response } from 'express';

export const router = Router();

router.use('/fifa-23', function (req: Request, res: Response) {
  res.send(
    'todo: process csv file containing 5.25GB of data from FIFA 23 male players 🌊'
  );
});
