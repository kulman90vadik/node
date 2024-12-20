import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
// import User from './models/User.js';



const app = express();
app.use(express.json()); // научили понимать json файлы

mongoose
.connect('mongodb://vkuhlmann:Vadik1990@cluster123-shard-00-00.dwucc.mongodb.net:27017,cluster123-shard-00-01.dwucc.mongodb.net:27017,cluster123-shard-00-02.dwucc.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-gr7xm8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster123')
.then(() => console.log('db ok'))
.catch((err) => console.log(`Error ${err}`))


// авторизация
app.post('/auth/login', loginValidation, UserController.login)
// запрос с валидацией / идём в аутх и проверяем
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);



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
