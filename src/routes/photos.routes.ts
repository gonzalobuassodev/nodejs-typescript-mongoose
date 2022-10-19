import express, { NextFunction, Request, Response } from 'express';
import { isRegularExpressionLiteral } from 'typescript';
import { middleware } from '../middleware/auth.middleware';
import { IPhotoFavReq, IPhotoReq, PhotoModel } from '../model/photo.model';

export const router = express.Router();

// agrego fotos a un album x id de album
router.post('/add-to-album', middleware, (req: Request, res: Response) => {
  const data: IPhotoReq[] = req.body;

  data.map(async (photo) => {
    const exist = await PhotoModel.findOne({ albums: photo.albumid });

    if (!exist) {
      await PhotoModel.findByIdAndUpdate(photo.id, {
        $push: { albums: photo.albumid },
      });
    }
  });

  res.send({ message: 'Success' });
});

// Router para agregar una foto a favoritos
router.post(
  '/add-favorite',
  middleware,
  async (req: Request, res: Response) => {
    const { id }: IPhotoFavReq = req.body;

    try {
      const result = await PhotoModel.findByIdAndUpdate(
        id,
        { favorite: true },
        { new: true }
      );
      res.send(result);
    } catch (error) {
      res.status(404).send({ message: 'error' });
    }
  }
);

// Router para remover una foto de favoritos
router.post(
  '/remove-favorite',
  middleware,
  async (req: Request, res: Response) => {
    const { id }: IPhotoFavReq = req.body;

    try {
      const result = await PhotoModel.findByIdAndUpdate(
        id,
        { favorite: false },
        { new: true }
      );
      res.send(result);
    } catch (error) {
      res.status(404).send({ message: 'error' });
    }
  }
);

// Router para obtener las fotos de un usuario
router.get(
  '/photos',
  middleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PhotoModel.find({ userid: req.session.user?._id });

    res.send(result);
  }
);

// Router para obtener una foto por id de un usuario
router.get('/photos/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await PhotoModel.find({ id, userid: req.session.user?.id });
    res.send(result);
  } catch (error) {
    res.send({ message: 'Error' });
  }
});
