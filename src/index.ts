import 'dotenv/config';
import { app } from './server';

const PORT: number = Number(process.env.PORT) || 4000;

app().listen(PORT, '127.0.0.1', () => {
  console.log(`Server started on port ${PORT}`);
});
