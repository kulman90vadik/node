import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors}  from './utils/index.js';

import { PostController, UserController } from './controllers/index.js';

import multer from 'multer';

import cors from 'cors'


const app = express();
// создаём хранилище multer где будут храниться все файлы изоброжения
const storage = multer.diskStorage({
  // выполниться функция ниже с параметрами, пропускаем сейчас их
  // и выполняем ф-ию cb
  destination: (_, file, cb) => {
    // получавет путь
    cb(null, 'uploads'); // НЕ получает ошибок и сохраняет данный в папку uploads
  },
  // прежде чем как сохранить он скажет как называется файл
  filename: (_, file, cb) => {
    cb(null, file.originalname); // НЕ получает ошибок и сохраняет данный в папку uploads
  },
});

const upload = multer({storage});

app.use(express.json()); // научили понимать json файлы
app.use('/uploads', express.static('uploads')); // если убрать то он не будет знать что лежит в папке с файлами. 

app.use(cors()); // ВАЖНО ДЛЯ ЗАПРОСА МЕЖДУ ЛОКАЛЬНЫМИ ХОСТАМИ ФРОНТА И БЕКЕНДА

mongoose
.connect('mongodb://vkuhlmann:Vadik1990@cluster123-shard-00-00.dwucc.mongodb.net:27017,cluster123-shard-00-01.dwucc.mongodb.net:27017,cluster123-shard-00-02.dwucc.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-gr7xm8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster123')
.then(() => console.log('db ok'))
.catch((err) => console.log(`Error ${err}`))


// авторизация
// checkAuth ----- проверка  на авторизацию
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
// запрос с валидацией / идём в аутх и проверяем
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/tags', PostController.getTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(3333, (err) => {
  if(err) {
    return console.log(err);
  }
  console.log('!!Server OK!! -- http://localhost:3333')
})




























// app.post('/auth/login', (req, res) => {
//   console.log(req.body); // будет undefine так как мы отправляли данные в формате json. А express не понимает что это
//   const token = jwt.sign({
//     email: req.body.email,
//     name: 'Vasja'
//   }, 'sicret123')
//   res.json({
//     success: true,
//     body: 'Был запрос Post',
//     token
//   });
// });

// // req --- то что прислал клиент мне
// // req --- то что я буду передовать клиенты : методы
// app.get('/', (req, res) => {
//   // как он мне пришлёт я ему отвечу
//   res.send('Hallloppppppppp');
// });
