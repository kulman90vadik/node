import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';

import UserModel from './models/User.js';

const app = express();
app.use(express.json()); // научили понимать json файлы

app.listen(3333, (err) => {
  if(err) {
    return console.log(err);
  }
  console.log('!!Server OK!!')
})


mongoose
.connect('mongodb://vkuhlmann:Vadik1990@cluster123-shard-00-00.dwucc.mongodb.net:27017,cluster123-shard-00-01.dwucc.mongodb.net:27017,cluster123-shard-00-02.dwucc.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-gr7xm8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster123')
.then(() => console.log('db ok'))
.catch((err) => console.log(`Error ${err}`))

// запрос с валидацией / идём в аутх и проверяем
app.post('/auth/register', registerValidation, async (req, res) => {

try {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10); // алгоритм шифрования
  const passwordHash =  await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    passwordHash, // пароль теперь зашифрован!!!
    avatarUrl: req.body.avatarUrl
  })

  const user = await doc.save();

  const token = jwt.sign(
    {
      _id: user._id
    },
    'secret123',
    {
      expiresIn: '30d'
    }

  )

  // если всё ок то возвращаем что либо что нужно 
  res.json({
    ...user._doc, token
  });
}
catch(err){
  console.log(err);
  res.status(500).json({
    message: 'Не удалось зарегиться',
  });
}

});











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
