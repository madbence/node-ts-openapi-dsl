# TypeScript OpenAPI DSL

> Build OpenAPI3 contracts declaratively.

## Install

```sh
npm i ts-openapi-dsl
```

## Usage

### Schema helpers

Schema helpers can be used to remove _some_ boilerplate around JSON schema
definitions. Every helper returns a JSON schema object.

```ts
import { types as t } from 'ts-openapi-dsl';

const User = t.object('An object that represents a user', {
  id: t.integer('The ID of the user'),
  name: t.string('The name of the user'),
  createdAt: t.dateTime(),
  foo: {
    type: 'string',
    description: 'You can use raw JSON schema as well...',
  },
});
```

#### Reference

Every helper accepts an `extra` parameter that can be used to decorate the schema with additional properties.

##### `boolean(description?: string, extra?: Schema): Schema`

Defines a boolean schema, essentially:

```ts
const type = {
  type: 'boolean',
  description,
  ...extra,
};
```

##### `integer(description?: string, extra?: Schema): Schema`

Defines an integer schema, essentially:

```ts
const type = {
  type: 'integer',
  description,
  ...extra,
};
```

##### `string(description?: string, extra?: Schema): Schema`

Defines a string schema, essentially:

```ts
const type = {
  type: 'string',
  description,
  ...extra,
};
```

##### `pattern(pattern: RegExp, description?: string, extra?: Schema): Schema`

Defines a string schema with a regex pattern.

##### `date(description?: string, extra?: Schema): Schema`

Defines a string schema with `date` format.

##### `dateTime(description?: string, extra?: Schema): Schema`

Defines a string schema with `date-time` format.

##### `constant(value: string, description?: string, extra?: Schema): Schema`

Defines a string schema with an `enum` that only accept a single value, essentially:

```ts
const type = {
  type: 'string',
  description,
  enum: [value],
  ...extra,
};
```

##### `choice(values: Record<string, string>, extra?: Schema): Schema`

Defines a string schema with an `enum` that only accepts predefined values. Keys of `values` are the allowed values, and the corresponding values in the object are the descriptions.

```ts
const type = choice({
  FOO: 'Description of FOO',
  BAR: 'Description of BAR',
});

// same as
cons type = {
  type: 'string',
  enum: ['FOO', 'BAR'],
  description: '* `FOO` - Description of FOO\n* `BAR` - Description of BAR',
};
```

##### `array(items: Schema, description?: string, extra?: Schema): Schema`

Defines an array schema with the specified `items`, essentially:

```ts
const type = {
  type: 'array',
  description,
  items,
  ...extra,
};
```

##### `object(properties: Record<string, Schema>, description?: string, extra?: Schema): Schema`

Defines an object schema with the specified properties.

Every helpers has an `optional` variant, eg. `string.optional(...)`, which signals to its parent object to make it an optional property.

Objects are strict by default (ie. `additionalProperties` is set to `false`).

```ts
const type = object({
  foo: string(),
  bar: string.optional(),
});

// same as
const type = {
  type: 'object',
  additionalProperties: false,
  required: ['foo'],
  properties: {
    foo: {
      type: 'string',
    },
    bar: {
      type: 'string',
    },
  },
};
```

## License

MIT
