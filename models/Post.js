import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    unique: true
  },
  tags: {
    type: Array,
    default: []
  },
  viewsCount: { // количесвто просмотров статьи
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // так как есть id у пользователя в базе данных
    ref: 'User', // связь или ссылка на пользователя 
    required: true
  },
  imageUrl: String,
}, {
  timestamps: true
});

export default mongoose.model('Post', PostSchema);