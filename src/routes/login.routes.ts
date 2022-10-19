import bcrypt from 'bcrypt';
import express, { NextFunction, Request, Response } from 'express';
import { IUser, UserModel } from '../model/user.model';

export const router = express.Router();

router.get('/login', async (req: Request, res: Response) => {
  //Obtengo los datos de login
  const { username, password } = req.body;

  if (!username || !password) {
    res.send({ message: 'Invalid username or password' });
  } else {
    try {
      const userExists = await UserModel.findById({ username });
      if (userExists) {
        const userFound = await UserModel.findById({ username });
      } else {
        res.send({ message: 'Username o password uncorrect' });
      }
    } catch (error) {}
  }

  //envio datos de login al frontend
  res.send({ message: username });
});

router.get('signup', (req: Request, res: Response) => {});

router.post(
  '/auth',
  async (req: Request, res: Response, next: NextFunction) => {
    // Obtengo el usuario y contraseña del body
    const { username, password } = req.body;
    // Verifico que llege el usuario y contraseña
    if (!username || !password) {
      res.send({ message: 'Invalid username or password' });
    } else {
      // Consulto en la base de datos por los datos recibidos
      const user: IUser | null = await UserModel.findOne({ username });
      // comparo la contraseña guardar que esta encryptada con la contraseña recibida del frontend
      const passwordOk = await bcrypt.compare(password, String(user?.password));

      console.log(user);
      if (passwordOk) {
        req.session.user = user;
        res.send({ message: 'username and password correct' });
      } else {
        console.log(user);
        res.send({ message: 'Invalid username or password' });
      }
    }
  }
);

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name } = req.body;

    console.log('register', username, password, name);

    if (!username || !password || !name) {
      console.log('no hay username o password');
      res.send({ message: 'No hay username o password' });
    } else {
      // Consulto con el nuevo objeto de tipo UserModel por el usuario obtenido
      const userExist = await UserModel.findOne({ username });

      // pregunto si existe
      if (userExist) {
        // envio un mensaje al frontend que el usuario es existente
        res.send({ message: 'User already exists' });
      } else {
        // Si el usuario no existe lo grabo en la base de datos
        const newUser = new UserModel({ username, password, name });
        const result = await newUser.save();
        console.log('User added');
        // envio el nuevo usuario al frontend
        res.send({ result });
      }
    }
  }
);
