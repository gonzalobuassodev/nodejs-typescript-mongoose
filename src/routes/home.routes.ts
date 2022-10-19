import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { IPhoto, PhotoModel } from '../model/photo.model';

// creo el objeto storage para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.');
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + '.' + ext[ext.length - 1]);
  },
});

// defino el objeto multer
const upload = multer({ storage });

export const router = express.Router();

router.get('/home', (req: Request, res: Response) => {});

//routa para subir la foto con el middleware upload
router.post(
  '/upload',
  upload.single('photos'),
  async (req: Request, res: Response) => {
    //capturo la info de la foto que viene del frontend
    const file = req.file!;

    try {
      const photoProps: IPhoto = {
        filename: file.filename,
        mimeType: file.mimetype,
        userid: req.session.user?._id,
        size: file?.size,
        createdAt: new Date(),
        favorite: false,
        albums: [],
      };

      const newPhoto = new PhotoModel(photoProps);
      const result = await newPhoto.save();

      res.send({ result });
    } catch (error) {
      res.send({ message: 'error saving photo', error });
    }
  }
);
