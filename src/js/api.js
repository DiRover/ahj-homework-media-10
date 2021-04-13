import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export default class API {
    constructor(msgContainer) {
        this.insertMsg = this.insertMsg.bind(this);//привязваем функцию
        this.permission = false;//для проверки разрешений
        this.msgContainer = msgContainer;//контейнер для сообщений
        this.id = undefined;//айди сообщения на всякий случай
        this.text = undefined;//текст текстового сообщения
        this.time = undefined;//время сообщения
        this.button = undefined;//для определения какая кнопка была нажата
        this.recorder = undefined;//рекордер для записи видео/аудио
        this.stream = undefined;//поток аудио/видео
        this.src = undefined;//источник записи
        this.interval = undefined;//запись таймера для дальнейшей его остановки
        this.stopWatch = 'stopped';//нужно для проверки запуска таймера, чтобы не засорить память ещё один счётчиком
        this.streamDouble = undefined;//для дублирования видео в открывающееся окно
    }

    getInfo() {//получаем айди и дату записи
        this.id = uuidv4();
        this.time = moment().format('MMMM Do YYYY, h:mm a');
    }

    getGeo() {//получаем, если поддерживается браузером, геолокацию
        navigator.geolocation.getCurrentPosition(this.insertMsg); 
    }

    insertMsg(position) {//основная функция вставки сообщений в контейнер
        console.log(position);//объект, получаемый при поддержке браузером геолокации
        this.getInfo();//необходимо тут тоже прописать иначе когда браузер не поддерживает гео в сообщении не будет времени
        const { latitude, longitude } = position.coords;//получаем долготу и широту
        const elem = document.createElement('div');//создаём коробку для сообщения
        elem.setAttribute('data-id', this.id);//присваиваем сообщению айди на всякий случай
        elem.setAttribute('class', 'msg');//присваиваем стили
        if (this.button === 'text') {//проверяем тип сообщения
            elem.innerHTML = `
            <p class="msg-time">${this.time}</P>
            <p class="msg-text">${this.text}</p>
            <p class="msg-coords">[ ${latitude}, ${longitude} ]</p>`;
        } else if (this.button === 'audio') {//проверяем тип сообщения
            elem.innerHTML = `
            <p class="msg-time">${this.time}</p>
            <audio src=${this.src} controls></audio>
            <p class="msg-coords">[ ${latitude}, ${longitude} ]</p>`;
        } else if (this.button === 'video') {//проверяем тип сообщения
            elem.innerHTML = `
            <p class="msg-time">${this.time}</P>
            <video src=${this.src} controls></video>
            <p class="msg-coords">[ ${latitude}, ${longitude} ]</p>`;
        }
        this.msgContainer.appendChild(elem);//вставляем сообщение в контейнер
    }

    startTimer(box) { //таймер записи
        this.stopWatch = 'started'//нужно для проверки запуска таймера, чтобы не засорить память ещё один счётчиком
        let minutes = 0;//счётчик минут
        let seconds = 0;//счётчик секунд
        let ss;//переменная для отображения секунд
        let mm;//переменная для отображения минут
        this.interval = setInterval(() => {//интервал отрисовки таймера каждую секунду
            seconds += 1;//накрутка секунд
            if (seconds < 10) {//если секунд меньше 10
                ss = `0${seconds}`;//то пририсовываем "0"
            } else if (seconds > 9 && seconds < 60) { //если секунд от 9 до 60
                ss = seconds;//то ни чего не пририсовываемся
            } else if (seconds === 60) {//если секунды дошли до 60
                seconds = 0;//обнуляем счётчик секунд
                ss = `0${seconds}`;//пририсовываем к отображению секунд "0";
                minutes += 1;//накрутка минут
            }
            mm = minutes < 10 ? `0${minutes}` : minutes;//если минут меньше 10, то пририсовываем "0", если больше, то ни чего не пририсовываем
            box.innerHTML = `${mm}:${ss}`; //записываем в бокс показания секундомера
        }, 1000);
    };

    stopTimer(box) {//остановка таймера записи
        clearInterval(this.interval); //просто удаляем интервал
        box.innerHTML = `00:00`;//обнуляем занчение счётчика
        this.stopWatch = 'stopped'; //отмечаем, что таймер остановили
    }
}