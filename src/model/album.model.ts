import mongoose from 'mongoose';

export interface IAlbum {
  _id?: string;
  name: string;
  userid?: string;
  isprivate: boolean;
  createdAt: Date;
}

const AlbumSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
  },
  name: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  isprivate: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const AlbumModel = mongoose.model('Album', AlbumSchema);
