/* eslint-disable no-console */
/* eslint-disable max-len */
import API from './api';
import validForm from './validForm';
import audioRecorder from './audioRecorder';
import videoRecorder from './videoRecorder';
import videoRecorderDouble from './videoRecorderDouble';

console.log('ok');

const textForm = document.querySelector('.text-form');// форма для тестового сообщения
const modalPermission = document.querySelector('.modal-permission');// модалка для запроса разрешений
const modalReqCoords = document.querySelector('.modal-req-cootds');// модалка для записи координат
const modalContainer = document.querySelector('.modal-container');
const nextBtn = document.querySelector('.modal-button-next');// кнопка получения разрешений
const okBtn = document.querySelector('.modal-button-ok');// кнопка ввода координат вручную и отопражения сообщения
const msgCoords = document.querySelector('.msg-coords');// поле записи кооординат вручную
const msgContainer = document.querySelector('.msg-container');// общий контейнер для сообщений
const timeLineInput = document.querySelector('.time-line-input');// поле ввода текстового сообщения
const audioButton = document.querySelector('.button-audio');// кнопка для создания аудио сообщения
const videoButton = document.querySelector('.button-video');// кнопка для создания видео сообщения
const modalMedia = document.querySelector('.modal-media');// модалка для вывода сообщения о не поддержки медиа
const buttonMediaUnsupport = document.querySelector('.modal-media-unsupport');// кнопка закрытия модалка для вывода сообщения о не поддержки медиа
const start = document.querySelector('.start');// кнопка старта записи
const stop = document.querySelector('.stop');// кнопка остановки записи
const buttonsTypeMsg = document.querySelector('.buttons-type-msg');// контейнер с кнопками типа сообщения, нужен для показа/скрытия этих кнопок
const buttonsControl = document.querySelector('.buttons-control');// контейнер с кнопками управления, нужен для показа/скрытия этих кнопок
const recordTime = document.querySelector('.record-time');// бокс для отображения времени таймера
const emptyMsg = document.querySelector('.empty-msg'); // нижнее сообщение о попытке отправить пустое сообщение
const permissionNotification = document.querySelector('.permission-notification');// нижнее сообщение, что разрешения до сих пор нет
const video = document.getElementById('video');

const api = new API(msgContainer);

window.addEventListener('load', () => { // после загрузки страницы требуем разрешения
  modalPermission.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => { // получили разрешение
  api.permission = true;
  modalPermission.classList.add('hidden');
});

textForm.addEventListener('submit', (e) => { // форма создания тестового сообщения
  e.preventDefault();
  if (!api.permission) { // проверяем было ли получено разрешение
    console.log('permission modal active');
    modalPermission.classList.remove('hidden');// если разрешения отсутствует, то запрашиваем
    permissionNotification.classList.remove('hidden');
    setTimeout(() => {
      permissionNotification.classList.add('hidden');
    }, 3000);
    return;
  }
  const target = e.currentTarget.checkValidity();// проверяем валидность формы, т.е. есть ли текст в нём
  console.log(target);
  if (!target) {
    console.log('empty message'); // если текст не был введён
    emptyMsg.classList.remove('hidden');
    setTimeout(() => {
      emptyMsg.classList.add('hidden');
    }, 3000);
    return;
  }
  api.button = 'text';// отмечаем, что была нажата кнопка создания тестового сообщения
  api.text = timeLineInput.value;// получаем текст
  if (!navigator.geolocation) { // проверяем поддержку браузером геолокации
    modalReqCoords.classList.remove('hidden');// если поддержки нет, показываем модалку с ручным вводом координат
    return;// сразу выходим из функции
  }
  api.getGeo();// если поддерживает, получаем координаты и создаём сообщение
  textForm.reset();// чистим форму
});

okBtn.addEventListener('click', (e) => { // ввод координат вручную
  e.preventDefault();
  const coords = validForm(msgCoords.value); // проверяем валидность введённых координат
  msgCoords.value = ''; // очищаем форму
  if (!coords) { // если координаты были введены невалидно
    modalReqCoords.classList.add('hidden'); // прячем модалку с вводом координат
    return;
  } // если координаты введены валидно
  api.insertMsg(coords);// создаём сообщение с текстром или аудио или видео, временем и координатами
  modalReqCoords.classList.add('hidden'); // закрываем модалку
  console.log(coords);
});

modalContainer.addEventListener('click', (e) => { // отмена ввода и закрытие любой модалки
  const cancel = e.target.classList.contains('modal-button-cancel');
  const unsupportOk = e.target.classList.contains('modal-media-unsupport');
  const parent = e.target.closest('.modal');
  if (cancel || unsupportOk) {
    parent.classList.add('hidden');
  }
});

audioButton.addEventListener('click', () => { // нажимаем кнопку для записи голосового сообщения
  console.log('audio button');
  if (!api.permission) { // проверяем было ли получено разрешение
    console.log('permission modal active');
    modalPermission.classList.remove('hidden');// если разрешения отсутствует, то запрашиваем
    permissionNotification.classList.remove('hidden');
    setTimeout(() => {
      permissionNotification.classList.add('hidden');
    }, 3000);
    return;
  }
  api.button = 'audio';// отмечаем, что была нажата кнопка записи аудио сообщения
  if (!navigator.mediaDevices) { // проверяем поддержку браузером медиа
    console.log('Your browser does not support audio record');
    modalMedia.classList.remove('hidden');// если не поддерживает огорчаем сообщением в модалке
    return;
  }
  buttonsTypeMsg.classList.add('hidden');
  buttonsControl.classList.remove('hidden');
});

videoButton.addEventListener('click', () => {
  console.log('video button');
  if (!api.permission) { // проверяем было ли получено разрешение
    console.log('permission modal active');
    modalPermission.classList.remove('hidden');// если разрешения отсутствует, то запрашиваем
    permissionNotification.classList.remove('hidden');
    setTimeout(() => {
      permissionNotification.classList.add('hidden');
    }, 3000);
    return;
  }
  api.button = 'video';
  if (!navigator.mediaDevices) { // проверяем поддержку браузером медиа
    console.log('Your browser does not support video record');
    modalMedia.classList.remove('hidden');// если не поддерживает огорчаем сообщением в модалке
    return;
  }
  buttonsTypeMsg.classList.add('hidden');
  buttonsControl.classList.remove('hidden');
});

buttonMediaUnsupport.addEventListener('click', () => { // закрытие модалки с сообщением о не поддержке
  modalMedia.classList.add('hidden');
});

start.addEventListener('click', () => { // старт записи
  if (api.stopWatch === 'started') return; // проверяем запущен ли был таймер до этого, одновременный запуск нескольких таймеров замусорит память
  if (api.button === 'audio') { // проверяем чё записываем видео или звук?
    audioRecorder(api);// функция записи аудио
  } else if (api.button === 'video') {
    video.classList.remove('hidden');
    videoRecorderDouble(api, video);// дублирование видео
    videoRecorder(api);// функция записи видео
  }
  api.startTimer(recordTime); // запускаем таймер записи
});

stop.addEventListener('click', () => { // остановка записи
  console.log('record stopped');
  console.log(api.recorder);
  if (api.recorder === undefined || api.recorder.state === 'inactive') { // проверяем существует ли (был запущен рекорд) и в принципе была ли запущена запись
    buttonsTypeMsg.classList.remove('hidden');// если это не проверить то будет ошибка и кнопки типа сообщений не появяться
    buttonsControl.classList.add('hidden');// скрываем кнопки контроля записи
    video.classList.add('hidden');
    return;
  }
  api.stopTimer(recordTime);// останавливаем таймер
  api.recorder.stop(); // останавливаем таймер
  api.stream.getTracks().forEach((track) => track.stop());
  buttonsTypeMsg.classList.remove('hidden');
  buttonsControl.classList.add('hidden');
  video.classList.add('hidden');
  api.streamDouble.getTracks().forEach((track) => track.stop());// прекращение дублирования видео
  video.srcObject = null;// прекращение дублирования видео
  if (!navigator.geolocation) { // проверяем поддержку браузером геолокации
    modalReqCoords.classList.remove('hidden');// если поддержки нет, показываем модалку с ручным вводом координат
    return;// сразу выходим из фукциии
  }
  api.getGeo();// если поддерживает, получаем координаты и создаём сообщение
});
