import {body} from 'express-validator';

// валидация

export const loginValidation = [
  body('email', 'Неверный формат email адреса').isEmail(), // если емаил корект то пропускаем дальше 
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({min: 5})
];

export const registerValidation = [
  body('email', 'Неверный формат email адреса').isEmail(), // если емаил корект то пропускаем дальше 
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({min: 5}),
  body('fullName', 'Имя должно содержать минимум 3 символа').isLength({min: 3}),
  body('avatarUrl', 'Некорректный URL для аватара').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
  body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional(),
  body('imageUrl', 'Неверная ссылка на изоброжение').optional().isString(),
];


