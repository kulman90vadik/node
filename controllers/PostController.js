import PostModel from '../models/Post.js';


export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); // для развёртывания usera информации
    res.json(posts);
  }

  catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
}


export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec(); // что???
    const tags = posts.map(obj => obj.tags).flat().slice(0, 5); // что????

    res.json(tags);
  }

  catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
}


export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; // Получаем ID из параметров

    // Обновляем viewsCount и возвращаем обновленный документ
    // если просто получить то findBId вроде
    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' } // Возвращаем обновленный документ
    ).populate('user')
    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};


export const remove = async (req, res) => {
  try {
    const postId = req.params.id; // Получаем ID из параметров

    // Удаляем документ и получаем его, если он существует
    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};


export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl, 
      // tags: req.body.tags,
      tags: req.body.tags.split(','),
      user: req.userId
    });

    const post = await doc.save();
    res.json(post)
  }
  catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }

}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl, 
        tags: req.body.tags.split(','),
        user: req.userId
      }
    );

    res.json({
      success: true,
    });
    
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось изменить статью",
    });
  }

} 