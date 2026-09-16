import {
  BaseType,
  createFormatter,
  createParser,
  createProgram,
  FunctionType,
  SchemaGenerator,
  SubTypeFormatter,
  CompletedConfig,
} from 'ts-json-schema-generator';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import standaloneCode from 'ajv/dist/standalone/index.js';
import * as fs from 'fs';

const outputFile = '../../dist/formly-field-validator/validator.mjs';
const config: CompletedConfig = {
  path: '../src/types.ts',
  tsconfig: '../../tsconfig.json',
  type: 'FormlyFieldConfig',
  minify: true,
  expose: 'export',
  topRef: false,
  jsDoc: 'none',
  markdownDescription: false,
  fullDescription: false,
  sortProps: false,
  strictTuples: true,
  skipTypeCheck: true,
  encodeRefs: false,
  extraTags: [],
  additionalProperties: false,
  discriminatorType: 'json-schema',
  functions: 'hide',
};

class FunctionTypeFormatter implements SubTypeFormatter {
  public supportsType(type: FunctionType): boolean {
    return type instanceof FunctionType;
  }

  public getDefinition(): any {
    return { typeof: 'function' };
  }

  public getChildren(): BaseType[] {
    return [];
  }
}

const program = createProgram(config);
const parser = createParser(program, config);
const formatter = createFormatter(config, (fmt) => {
  fmt.addTypeFormatter(new FunctionTypeFormatter());
});

const generator = new SchemaGenerator(program, parser, formatter, config);
const schemaField = generator.createSchema(config.type);
console.log('Schema created with ts-json-schema-generator.');

schemaField.$id = '/schema/field.json';
const schemaFields = {
  $id: '/schema/fields.json',
  type: 'array',
  items: {
    $ref: '/schema/field.json#/definitions/FormlyFieldConfig',
  },
};
const ajv = new Ajv({
  schemas: [schemaField, schemaFields],
  allowUnionTypes: true,
  code: { source: true, esm: true },
});
ajvKeywords(ajv, 'typeof');

const code = standaloneCode(ajv, {
  validateField: '/schema/field.json',
  validateFields: '/schema/fields.json',
});
console.log('Validators created with ajv.');

fs.writeFile(outputFile, code, (err: any) => {
  if (err) {
    throw err;
  } else {
    console.log(`Validators written to file: '${outputFile}'.`);
  }
});
