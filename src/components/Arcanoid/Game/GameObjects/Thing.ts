import BaseObject, { IBaseObjectProps } from 'Components/Arcanoid/Game/GameObjects/BaseObject';
import { GameWindowProps } from 'Components/Arcanoid/Game/types';
import drawThing from 'Components/Arcanoid/UI/drawThing';
import { THING_HEIGHT, THING_SPEED, THING_WIDTH } from 'Components/Arcanoid/settings';

/**
 * Тип бонуса Клей, Пушка, Расширение/сжатие ракетки
 */
export type ThingType = 'glue' | 'gun' | 'expand' | 'compress' | 'none';
export interface IThingProps extends IBaseObjectProps {
  thingType: ThingType
  x: number
  y: number
}

/**
 * Бонус
 */
class Thing extends BaseObject {
  thingType: ThingType = 'none'

  active = true;

  constructor(props: IThingProps) {
    super(props);
    this.thingType = props.thingType;
  }

  render(gw: GameWindowProps | undefined = undefined) {
    super.render(gw);
    if (!this.gameWindow || !this.ctx) {
      return;
    }
    const { ctx, gameWindow, thingType } = this;
    drawThing(ctx, gameWindow, this.x, this.y, thingType);
  }

  /**
   * Расчет положения для следующего кадра
   */
  nextMove() {
    this.y += THING_SPEED; // передвигаем вверх
    const { gameWindow } = this;
    if (this.y + THING_HEIGHT > gameWindow.top + gameWindow.height) {
      // убираем активное состояние, при вылете за пределы игровой зоны
      this.active = false;
    }
  }

  /**
   * Проверка пересечения с прямоугольным объектом
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @return {boolean} пересекается?
   */
  intersect(x: number, y: number, width: number, height: number): boolean {
    const intersectX = (this.x + THING_WIDTH >= x && this.x <= x + width);
    const intersectY = (this.y + THING_HEIGHT >= y && this.y <= y + height);
    return intersectX && intersectY;
  }
}

export default Thing;
