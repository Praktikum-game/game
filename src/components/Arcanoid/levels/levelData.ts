// 0 - промежуток 1/4 блока, если не 0, то 2 следующие цифры: 1-я уровень блока, 2-я бонусы.
// Бонусы:
// 2 - пушка
// 3 - клей
// 4- расширение ракетки
// 5 - сужение ракетки
// 6 - разделение шарика
// 7 - fireball
// 9 - случайный бонус, или 50% вероятность отсутствия бонуса
// 1, 6, 7, 8 - нет бонуса
// Пример 0011023042
// Пусто, Пусто, Блок уровень 1 без бонуса,
// Пусто, Блок уровень 2 с клеем, Пусто, Блок уровня 4 с пушкой
const levels:string[][] = [
  [
    '0',
    '00011__11__0000000011__00000011__0011__11__000000011__0000011__11__00011__',
    '00019__0019__00011__011__000000000011__0011__0011__0011__0011__011__000000',
    '00016__0016__0011__000011__0011__0011__0011__0011__0011__0011__011__0011__',
    '00015__0015__0011__000011__0011__0011__0011__0011__0011__0011__11__00011__',
    '00014__0014__0011__11__11__0011__0011__11__000011__0011__0011__011__0011__',
    '00013__0013__0011__000011__0011__0011__0011__0011__0011__0011__011__0011__',
    '00017__0017__0017__000013__0014__0014__0015__0000015__0000016__16__00017__',
  ],
  [
    '00',
    '0011__000000011__0011__11__11__0000000000011__11__11__11__0000000011__000011__',
    '00021__0000021__00021__00000021__00000000011__00011__00011__00000011__000011__',
    '000031__00031__000031__00000031__00000000011__00011__00011__00000011__000011__',
    '00000041__41__0000041__00000041__00000000011__00011__00011__011__011__11__11__',
    '0000000051__000000051__51__51__0000000000011__00011__00011__0000000000000011__',
    '0000000041__000000041__000000000000000000011__00011__00011__0000000000000011__',
    '0000000036__000000036__000000000000000000016__00016__00016__0000000000000016__',
  ],
  [
    '11__012__013__014__015__016__019__016__015__014__013__',
    '021__022__023__024__025__026__029__026__025__024__023__',
    '0031__032__033__034__035__036__039__036__035__034__033__',
    '41__042__043__044__045__046__049__046__045__044__043__',
    '051__052__053__054__055__056__059__056__055__054__053__',
    '0011__012__013__014__015__016__019__016__015__014__013__',
  ],
  [
    '021__022__023__024__025__026__029__026__025__024__023__',
    '0031__032__033__034__035__036__039__036__035__034__033__',
    '11__012__013__014__015__016__019__016__015__014__013__',
    '0011__012__013__014__015__016__019__016__015__014__013__',
    '41__042__043__044__045__046__049__046__045__044__043__',
    '051__052__053__054__055__056__059__056__055__054__053__',
  ],
];
export default levels;
