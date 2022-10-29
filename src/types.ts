import { SchemaObject } from 'openapi3-ts';

const optional = Symbol('optional');
const required = Symbol('optional');

type Schema = SchemaObject & {
  [optional]?: boolean;
  [required]?: boolean;
};

type SchemaBuilder<T extends any[]> = (...args: T) => Schema;
type SchemaBuilderExtra<T extends any[]> = (
  ...args: T | [...T, SchemaObject]
) => Schema;

type SchemaHelper<T extends any[]> = SchemaBuilderExtra<T> & {
  optional: SchemaBuilderExtra<T>;
  required: SchemaBuilderExtra<T>;
};

function defineType<T extends any[]>(
  type: string,
  fn: SchemaBuilder<T>
): SchemaHelper<T> {
  const wrapped: SchemaBuilderExtra<T> = (...args) => ({
    type,
    ...fn(...(args.slice(0, fn.length) as T)),
    ...args[fn.length],
  });

  (wrapped as SchemaHelper<T>).optional = (...args) => {
    const type = wrapped(...args);
    type[optional] = true;
    return type;
  };

  (wrapped as SchemaHelper<T>).required = (...args) => {
    const type = wrapped(...args);
    type[required] = true;
    return type;
  };

  return wrapped as SchemaHelper<T>;
}

export const boolean = defineType('boolean', (description?: string) => ({
  description,
}));

export const integer = defineType('integer', (description?: string) => ({
  description,
}));

export const string = defineType('string', (description?: string) => ({
  description,
}));

export const pattern = defineType(
  'string',
  (pattern: RegExp, description?: string) => ({
    description,
    pattern: pattern.toString().slice(1, -1),
  })
);

export const date = defineType('string', (description?: string) => ({
  description,
  format: 'date',
}));

export const dateTime = defineType('string', (description?: string) => ({
  description,
  format: 'date-time',
}));

export const constant = defineType(
  'string',
  (value: string, description?: string) => ({
    description,
    enum: [value],
  })
);

export const choice = defineType(
  'string',
  (values: Record<string, string>) => ({
    description: Object.entries(values)
      .map(([key, value]) => `* \`${key}\` - ${value}`)
      .join('\n'),
    enum: Object.keys(values),
  })
);

export const array = defineType(
  'array',
  (items: Schema, description?: string) => ({
    description,
    items,
  })
);

export const object = defineType(
  'object',
  (properties: Record<string, Schema>, description?: string) => ({
    description,
    required: Object.entries(properties)
      .filter(([_, value]) => !value[optional])
      .map(([key, _]) => key),
    additionalProperties: false,
    properties,
  })
);
