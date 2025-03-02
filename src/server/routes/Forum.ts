import Routes from 'Server/routes/Routes';
import express, { Request, Response } from 'express';
import { FORUM_URL } from 'Config/config';
import { isLogged } from 'Server/middlewares/isLogged';
import { logger } from 'Server/middlewares/logger';
import {
  MessageCreationAttributes, MessageModel, TopicCreationAttributes, TopicModel,
} from 'Server/db/models/forum';
import { UserModel } from 'Server/db/models/user';
import { cloneObject } from 'Util/cloneObject';
import { EHttpStatusCodes } from 'Server/types';
import { IMessagesItem, ITopicInfo, ITopicsItem } from 'Reducers/forum/types';
import { getDisplayName } from 'Store/util';
import { bodyChecker } from 'Server/middlewares/bodyChecker';
import { escapedString } from 'Util/escapedString';
import Auth from 'Server/routes/Auth';
import { IUser } from 'Store/types';
import { toNumber } from 'Util/toNumber';
import { TUserInfo } from 'Pages/Forums/UserInfoPage/UserInfo/types';
import { Sequelize } from 'sequelize-typescript';

export default class Forum extends Routes {
  constructor(app: express.Application) {
    super(app, 'Forum');
  }

  configRoutes() {
    /**
     * Topic list
     */
    this.app.get(`${FORUM_URL}/`, [isLogged(), logger({ needParams: true })], async (_req: Request, res: Response) => {
      try {
        const topicsFromDb = await TopicModel.findAll({
          include: [
            {
              model: UserModel,
              required: true,
            },
          ],
        });

        const topics: ITopicsItem[] = [];
        const list = cloneObject(topicsFromDb);
        // eslint-disable-next-line no-restricted-syntax
        for (const {
          date,
          id,
          title,
          user,
          userId,
        } of list) {
          // eslint-disable-next-line no-await-in-loop
          const { count, rows } = await MessageModel.findAndCountAll({
            where: {
              topicId: id,
            },
            order: [['date', 'desc']],
            limit: 1,
            include: {
              model: UserModel,
              required: true,
            },
          });
          const messagesRow = cloneObject(rows);
          const row = messagesRow[0];
          const lastTitle = escapedString(row ? row.title as string : '');
          const lastMessage = escapedString(row ? row.message as string : '');
          const lastAuthor = row ? getDisplayName(row.user as IUser) : '';
          const lastDate = row ? Number(new Date(row.date).getTime()) : 0;

          const topicItem: ITopicsItem = {
            id: id as number,
            author: getDisplayName(user as IUser),
            authorId: userId as number,
            description: escapedString(title as string),
            messageCount: Number(count),
            createTime: date as number,
            lastTitle,
            lastMessage,
            lastAuthor,
            lastDate,
          };
          topics.push(topicItem);
        }
        res.status(EHttpStatusCodes.OK).send(topics);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error get topic list', e);
        res.status(EHttpStatusCodes.BAD_REQUEST).send(e);
      }
    });

    /**
     * New topic
     */
    this.app.post(`${FORUM_URL}/`, [logger({ needBody: true }), isLogged(), bodyChecker()], async (req: Request, res: Response) => {
      try {
        const { title } = req.body;
        const user = await Auth.getUser(req);
        const createTime = new Date();
        const newTopic: TopicCreationAttributes = {
          date: createTime,
          title,
          userId: user?.id as number,
        };
        const topic = cloneObject(await TopicModel.create(newTopic));
        const answer: ITopicsItem = {
          id: topic.id as number,
          description: escapedString(topic.title),
          author: getDisplayName(user),
          authorId: user?.id as number,
          createTime: createTime.getTime(),
          messageCount: 0,
        };
        res.status(EHttpStatusCodes.OK).send(answer);
      } catch (e) {
        res.status(EHttpStatusCodes.FORBIDDEN).send(e);
      }
    });

    /**
     * Messages on topic
     */
    this.app.get(
      `${FORUM_URL}/thread/:id`,
      [
        logger({ needParams: true }),
        isLogged(),
      ],
      async (req: Request, res: Response) => {
        const topicId = parseInt(req.params.id, 10) || 0;

        try {
          const count = await TopicModel.count({
            where: {
              id: topicId,
            },
          });
          if (count === 0) {
            res.status(EHttpStatusCodes.OK).send({ state: 0, messages: [] });
            return;
          }
        } catch (e) {
          res.status(EHttpStatusCodes.OK).send({ state: 0, messages: [] });
          return;
        }

        try {
          const messagesDB = (await MessageModel.findAll({
            where: {
              topicId,
            },
            include: {
              model: UserModel,
              required: true,
            },
          }));
          const messages: IMessagesItem[] = [];
          messagesDB.forEach((d: MessageModel) => {
            const u = cloneObject(d).user;
            const message = d.get();
            const id = toNumber(message.id);
            const emoji = toNumber(message.emoji);
            const author = getDisplayName(u as IUser);
            const authorId = toNumber(message.userId);
            messages.push({
              id,
              author,
              authorId,
              emoji,
              topic: topicId,
              message: message.message ?? '',
              parentMessage: toNumber(message.parent),
              header: message.title ?? '',
              time: (message.date as Date).getTime(),
            });
          });
          res.status(EHttpStatusCodes.OK).send({ state: 1, messages });
        } catch (e) {
          res.status(EHttpStatusCodes.BAD_REQUEST).send({ state: 0, messages: [], error: e });
        }
      },
    );

    /**
     * Получение информации о пользователе и сообщениях
     */
    this.app.get(
      `${FORUM_URL}/userinfo/:id`,
      [
        logger({ needParams: true }),
        isLogged(),
      ],
      async (req: Request, res: Response) => {
        const userInfo: TUserInfo = {
          user: undefined,
          topics: [],
          count: 0,
        };

        const returnRes = () => {
          res.status(EHttpStatusCodes.OK).send(JSON.stringify(userInfo));
        };

        let id;
        try {
          id = parseInt(req.params.id, 10);
        } catch (_e) {
          id = 0;
        }
        res.set({
          'Content-type': 'application/json',
        });
        if (id === 0) {
          returnRes();
          return;
        }

        let user;
        try {
          const userModel = await UserModel.findOne({
            where: {
              id,
            },
          });
          if (userModel) {
            user = cloneObject(userModel) as IUser;
          }
        } catch (e) {
          //
        }

        if (!user) {
          returnRes();
          return;
        }

        userInfo.user = user;
        try {
          const messagesModel = await MessageModel.findAll({
            attributes: [[Sequelize.fn('count', Sequelize.col('topic.id')), 'count']],
            group: ['topic.id', 'topic.title'],
            raw: true,
            where: {
              userId: id,
            },
            include: [
              {
                model: TopicModel,
                attributes: ['title', 'id'],
              },
            ],
          });
          if (messagesModel) {
            const messages = cloneObject(messagesModel);
            let count = 0;
            const msg: ITopicInfo[] = [];
            messages.forEach((message: { [x: string]: any; count: any; }) => {
              count += Number(message.count);
              const title = message['topic.title'];
              msg.push({ id: Number(message['topic.id']), title, count: Number(message.count) });
            });
            userInfo.count = count;
            userInfo.topics = msg;
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Error get messages', e);
        }
        returnRes();
      },
    );

    this.app.post(`${FORUM_URL}/thread/:id`,
      [
        logger({ needBody: true, needParams: true }),
        isLogged(),
        bodyChecker(),
      ], async (req: Request, res: Response) => {
        let id;
        try {
          id = parseInt(req.params.id, 10) || 0;
        } catch (e) {
          id = 0;
        }
        const date = new Date();
        const {
          message,
          parentMessage,
          topic,
          header,
          emoji,
        } = req.body;
        try {
          const user = await Auth.getUser(req);
          const msg: MessageCreationAttributes = {
            message,
            topicId: topic,
            title: header,
            userId: user?.id,
            parent: parentMessage,
            emoji,
          };
          let newMessage;
          if (id === 0) {
            newMessage = cloneObject(await MessageModel.create({ ...msg, date }));
          } else {
            newMessage = cloneObject(await MessageModel.update(msg, {
              where: {
                id,
              },
            }));
          }
          const answer: IMessagesItem = {
            id: toNumber(newMessage.id),
            topic: toNumber(newMessage.topic),
            message: newMessage.message,
            time: new Date(newMessage.date).getTime(),
            header: newMessage.title,
            parentMessage: newMessage.parent,
            authorId: newMessage.userId,
            emoji: newMessage.emoji,
            author: getDisplayName(user),
          };
          res.status(EHttpStatusCodes.OK).send(answer);
        } catch (e) {
          res.status(EHttpStatusCodes.BAD_REQUEST).send(e);
        }
      });
    return this.app;
  }
}
