import { SchemaObject } from 'openapi3-ts';

const _optional = Symbol('optional');
const _required = Symbol('optional');

type Schema = SchemaObject & {
  [_optional]?: boolean;
  [_required]?: boolean;
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
    type[_optional] = true;
    return type;
  };

  (wrapped as SchemaHelper<T>).required = (...args) => {
    const type = wrapped(...args);
    type[_required] = true;
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

export const number = defineType('number', (description?: string) => ({
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

export const binary = defineType('string', (description?: string) => ({
  description,
  format: 'binary',
}));

export const email = defineType('string', (description?: string) => ({
  description,
  format: 'email',
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

function getRequiredProperties(properties: Record<string, Schema>) {
  const required = Object.entries(properties)
    .filter(([_, value]) => !value[_optional])
    .map(([key, _]) => key);
  if (required.length) return required;
  return undefined;
}

export const object = defineType(
  'object',
  (properties: Record<string, Schema>, description?: string) => ({
    description,
    required: getRequiredProperties(properties),
    additionalProperties: false,
    properties,
  })
);

export const optional = (schema: Schema) => ({
  ...schema,
  [_optional]: true,
});

export const required = (schema: Schema) => ({
  ...schema,
  [_required]: true,
});
