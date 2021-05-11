import Fetch, { TFetchOptions } from 'Server/fetch/Fetch';
import Cookies from 'Server/fetch/Cookies';
import { Express } from 'express';

const leaderRoutes = (app: Express, json: any, url: string, serverUrl: string) => {
  app.post(`${url}/all`, json, (req, res) => {
    if (!req.body) {
      res.status(400).send({ reason: 'Error in parameters' });
      return;
    }
    const profileOptions: TFetchOptions = {
      data: req.body,
      headers: {
        cookie: Cookies.getCookies(req),
      },
    };
    const serverAddress = `${serverUrl}/all`;
    Fetch.post(serverAddress, profileOptions)
      .then(async (answer) => {
        res.status(200).send(await answer.json());
      })
      .catch((error) => {
        res.status(error.status).send(error.statusText);
      });
  });

  app.post(`${url}`, json, (req, res) => {
    const { body } = req;
    if (!body) {
      res.status(400).send({ reason: 'Error in parameters' });
      return;
    }
    const profileOptions: TFetchOptions = {
      data: body,
      headers: {
        cookie: Cookies.getCookies(req),
      },
    };
    const serverAddress = `${serverUrl}`;
    Fetch.post(serverAddress, profileOptions)
      .then(() => {
        res.status(200).send('OK');
      })
      .catch((error) => {
        res.status(error.status).send(error.statusText);
      });
  });
};

export default leaderRoutes;
