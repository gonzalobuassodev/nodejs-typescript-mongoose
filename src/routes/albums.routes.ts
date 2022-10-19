import express, { NextFunction, Request, Response } from 'express';
import { AlbumModel, IAlbum } from '../model/album.model';
import { IPhoto, PhotoModel } from '../model/photo.model';

export const router = express.Router();

//obtengo el listado de albunes pero solo del usuario logueado
router.get(
  '/album',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albums = await AlbumModel.find({ userid: req.session.user?.id });

      res.send(albums);
    } catch (error) {}
  }
);

// obtengo album x id de album
router.get(
  '/album/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const albumid = req.params.id;
    // console.log(id);
    const result: IPhoto[] = await PhotoModel.find({ albums: albumid });

    // res.status(200).json(result);

    const album = await AlbumModel.findById(albumid);

    if (album?.userid !== req.session.user?.id && album?.isprivate) {
      res.send(result);
    } else {
      res.send({
        message: 'The user dont have permission to access this album',
      });
    }
  }
);

// creo un album
router.post('/album', async (req: Request, res: Response) => {
  const { name, isprivate }: IAlbum = req.body;

  //   console.log(name, isprivate);

  try {
    const albumProps: IAlbum = {
      name: name,
      userid: req.session.user?._id,
      isprivate: isprivate,
      createdAt: new Date(),
    };

    const newAlbum = new AlbumModel(albumProps);
    const result = await newAlbum.save();

    res.send({ result });
  } catch (error) {
    res.send(error);
  }
});
