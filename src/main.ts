import express, { Request, Response } from 'express';
import { router } from './router';
const app = express();
const PORT = 3000;

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World');
});

app.listen(PORT, () => console.log(`Listening on ${PORT} 📚🚀`));

app.use(router);
