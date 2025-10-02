import mongoose from 'mongoose';


const FavoriteSchema = new mongoose.Schema(
{
nasa_id: { type: Number, required: true, index: true },
img_src: { type: String, required: true },
earth_date: { type: String },
sol: { type: Number },
rover: { type: String, required: true },
camera: { type: String },
// Optional: anonymous session id could be added later
},
{ timestamps: true }
);


FavoriteSchema.index({ nasa_id: 1 }, { unique: true });


export default mongoose.model('Favorite', FavoriteSchema);