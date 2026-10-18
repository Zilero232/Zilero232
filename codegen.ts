import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'node_modules/@octokit/graphql-schema/schema.graphql',
  documents: 'src/github/query.graphql',
  generates: {
    'src/github/generated/query.types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        onlyOperationTypes: true,
        avoidOptionals: true,
        skipTypename: true,
        scalars: { DateTime: 'string', URI: 'string' }
      }
    }
  }
};

export default config;
