import { Router, Request, Response } from 'express';
import { pipeline } from 'stream/promises';
import Service from './service';

const router = Router();
const service = new Service();

router.get(`/fifa-23/:filename`, async function (req: Request, res: Response) {
  const { filename } = req.params;

  if (!filename) {
    res.send('Missing file name parameter').status(400);
  }

  try {
    const controller = new AbortController();

    await pipeline(
      service.streamFile(`data/fifa-23/${filename}.csv`),
      service.transform,
      service.write,
      {
        signal: controller.signal,
      }
    );

    res.send('OK');
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return res.send({
        error: "This file or directory doesn't exist",
      });
    }

    return res.send({ error: JSON.stringify(e) });
  }
});

export default router;
