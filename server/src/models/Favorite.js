import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    nasa_id: { type: Number, required: true }, // no field-level index here
    img_src: { type: String, required: true },
    earth_date: { type: String },
    sol: { type: Number },
    rover: { type: String, required: true },
    camera: { type: String },
  },
  { timestamps: true }
);

// single unique index on nasa_id
FavoriteSchema.index({ nasa_id: 1 }, { unique: true });

export default mongoose.model('Favorite', FavoriteSchema);
