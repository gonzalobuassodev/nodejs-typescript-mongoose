import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session, { Session } from 'express-session';
import { join } from 'path';
import mongoose from 'mongoose';

import { router as LoginRoutes } from './routes/login.routes';
import { router as HomeRoutes } from './routes/home.routes';
import { router as AlbumRoutes } from './routes/albums.routes';
import { router as PhotoRoutes } from './routes/photos.routes';

import { IUser } from './model/user.model';

declare module 'express-session' {
  interface Session {
    user: IUser | null;
  }
}

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(join(__dirname, '../public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

const options: mongoose.ConnectOptions = {
  dbName: process.env.DBNAME as string,
  user: process.env.DB_USER as string,
  pass: process.env.DB_PASS as string,
};

(async () => {
  await mongoose.connect(process.env.DB_CONNECTION as string, options);
  console.log('Connected to database');
})();

app.use(LoginRoutes);
app.use(HomeRoutes);
app.use(AlbumRoutes);
app.use(PhotoRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server listen on port: ', process.env.PORT);
});
