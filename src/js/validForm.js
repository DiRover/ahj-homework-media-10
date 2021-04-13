/* eslint-disable max-len */
export default function validForm(text) {
  const reqexp = /^\[?\s?[0-9]{1,2}.[0-9]+,\s?-?[0-9]{1,2}.[0-9]+\s?]?$/; // пришлось экранировать [, а ] нет
  const validCoords = reqexp.test(text); // проверяем валидность координат
  if (!validCoords) return false; // если не валидны выходим из функции
  const result = text.replace(/(\s|\[|\])/g, ''); // удаляем скобки [ ]  и пробеды если есть
  const arr = result.split(','); // создаём массив с широтой и долготой
  return { coords: { latitude: arr[0], longitude: arr[1] } }; // возвращаем объект с широтой и долготой
}
