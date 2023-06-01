import { IncomingHttpHeaders } from 'http';

import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { ExecutionResult } from 'src/modules/regex/execute';
import { PatternInfo } from 'src/modules/regex/lookup';
import { expressions } from 'src/modules/regex/regex.module';

export const REGEX_API_URL = '/regex';

const regexHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { headers, body }: { headers: IncomingHttpHeaders; body: any } = request;

  // Check if the MIME type is JSON
  /*const contentType = headers['content-type'];
  if (!contentType || !/^application\/json/.test(contentType)) {
    reply.code(400).send('Invalid MIME type. Expected application/json.');
    return;
  }*/

  // Extract the file path from the request URL
  const filePath = (request as any).params['*'];

  try {
    const pattern: PatternInfo = expressions.lookup(filePath);
    const result: ExecutionResult = expressions.execute(body, pattern);

    if (result.error) {
      reply.code(400).send(result.error);
    }
    reply.code(200).send({ content: body, result: result.result });
  } catch (error) {
    reply.code(400).send((error as any).message);
  }
};

export const regex = {
  instance: (instance: FastifyInstance, options: FastifyPluginOptions, done: () => void) => {
    instance.post('*', regexHandler);
    done();
  },
  path: REGEX_API_URL,
};