import mongoose from 'mongoose';

export interface IPhotoReq {
  id: string;
  albumid: string;
}

export interface IPhotoFavReq {
  id: string;
  favorite: boolean;
}

export interface IPhoto {
  _id?: string;
  filename: string;
  userid: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  favorite: boolean;
  albums: string[];
}

const PhotoSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  filename: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  favorite: {
    type: Boolean,
    required: true,
    default: false,
  },
  albums: {
    type: Array,
    required: false,
    default: [],
  },
});

export const PhotoModel = mongoose.model('Photo', PhotoSchema);
