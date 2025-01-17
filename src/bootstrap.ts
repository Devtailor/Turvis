import { IncomingMessage, Server, ServerResponse } from 'http';

import fastify, { FastifyInstance } from 'fastify';
import { incoming } from 'src/api/incoming';
import { regex } from 'src/api/regex';

export const bootstrap = (options = {}) => {
  const application: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify(options);

  application.register(incoming.instance, { prefix: incoming.path });
  application.register(regex.instance, { prefix: regex.path });

  return application;
};
