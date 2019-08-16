Файл локализации с которым работает скрипт:

https://docs.google.com/spreadsheets/d/1P4PQoMOkd_X6Z-LMWsmW3Xk3uRzoWODKLzWYDxLbBMY/edit#gid=1513256945

Скрипт запускается через `npm start`, поэтому предварительно нужно установить https://nodejs.org/en/ и выполнить в корневой папке проекта `npm install` для установки необходимых пакетов. 

Скрипту передаются следующие параметры:

1. Платформа: `ios`, `android` или `yii2`
2. Тип данных для локализации: `strings`, `plurals`, `info`. В примере этим типам отведены соответствующие таблицы.
3. Идентификатор файла google sheets (часть пути)
4. Область поиска ключей и значений вроде 'AutoGen-Strings!A1:D'. Первая колонка воспринимается как содержащая ключи.
5. Путь для сохранения локализации

После запуска, скрипт попросит авторизоваться. После авторизации, данные авторизации сохраняются в папку пользователя по пути `/.credentials/sheets.googleapis.com-nodejs-quickstart.json` 

Если при запуске скрипта возникает ошибка `invalid_grant`, вышеуказанный файл нужно удалить



### iOS

`
npm start ios strings 1P4PQoMOkd_X6Z-LMWsmW3Xk3uRzoWODKLzWYDxLbBMY 'AutoGen-Strings!A1:D' ../selfie-battle/Resources/
`

### yii2

`
npm start yii2 strings '1-hImMGGZqQ_q9HU3GG1mStMSS21Vifn51CUHhUfma9M' 'admin-panel!A1:C' app/messages/
`

### Android

`
npm start android strings 1P4PQoMOkd_X6Z-LMWsmW3Xk3uRzoWODKLzWYDxLbBMY 'AutoGen-Strings!B1:E' ../selfie-battle-android/app/src/main/res
npm start android plurals 1P4PQoMOkd_X6Z-LMWsmW3Xk3uRzoWODKLzWYDxLbBMY 'AutoGen-Plurals!B1:F' ../selfie-battle-android/app/src/main/res
`