// 0 - промежуток 1/4 блока, если не 0, то 2 следующие цифры: 1-я уровень блока, 2-я бонусы.
// Бонусы:
// 2 - пушка
// 3 - клей
// 4- расширение ракетки
// 5 - сужение ракетки
// 9 - случайный бонус, или 50% вероятность отсутствия бонуса
// 1, 6, 7, 8 - нет бонуса
// Пример 0011023042
// Пусто, Пусто, Блок уровень 1 без бонуса,
// Пусто, Блок уровень 2 с клеем, Пусто, Блок уровня 4 с пушкой
const levels:string[][] = [
  [
    '00',
    '0011110000011110000011111111',
    '000111100011110000001100000000011',
    '000011120211100000001100000000011',
    '000001123112300000001100000000011',
    '0000000222222000000000111111111',
    '00000000012320000000000011',
    '00000000012320000000000011',
    '00000000012320000000000011',
  ],
  [
    '00',
    '00000000000000000000',
    '00011012012021022023021022023031041051041031021',
    '00000000000000000000',
    '000019019019029029029019019019019019019029036046',
  ],
  [
    '00000000110000000000',
    '011012012021022023031012013011011011',
    '0000000000000000000000000',
    '11012013021022023031032013019029036049056',
  ],
];
export default levels;
