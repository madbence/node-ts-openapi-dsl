import {
  MediaTypeObject,
  ResponseObject,
  OperationObject,
  PathsObject,
} from 'openapi3-ts';

export const $path = Symbol('path');
export const $method = Symbol('path');

type Response = MediaTypeObject & ResponseObject;
type ResponseWithType = Response & {
  type: string;
};

type Method =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';
type Operation = OperationObject & {
  path: string;
  method: Method;
};
type OperationWithMeta = OperationObject & {
  [$path]: string;
  [$method]: string;
};

export function response(props: ResponseWithType): ResponseObject {
  return {
    description: props.description,
    headers: props.headers,
    links: props.links,
    content: {
      [props.type]: {
        schema: props.schema,
        examples: props.examples,
        example: props.example,
        encoding: props.encoding,
      },
    },
  };
}

export function json(props: Response) {
  return response({
    type: 'application/json',
    ...props,
  });
}

export function operation(op: Operation): OperationWithMeta {
  const { path, method, ...rest } = op;
  return {
    [$path]: path,
    [$method]: method,
    ...rest,
  };
}

export function paths(ops: Record<string, OperationWithMeta>) {
  const paths: PathsObject = {};
  for (const [operationId, operation] of Object.entries(ops)) {
    if (!paths[operation[$path]]) paths[operation[$path]] = {};
    paths[operation[$path]][operation[$method]] = {
      operationId,
      ...operation,
    };
  }
  return paths;
}
