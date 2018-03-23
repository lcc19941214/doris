import { GET, POST } from './const';
import createRequest, { createAlias } from './createRequest';

const get = createAlias(GET);
const post = createAlias(POST);
const create = createRequest;

export { get, post, create };
