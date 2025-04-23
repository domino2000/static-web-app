module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-optional-catch-binding',
    '@babel/plugin-transform-private-property-in-object',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-unicode-property-regex',
    '@babel/plugin-transform-numeric-separator',
    '@babel/plugin-transform-object-rest-spread',
    '@babel/plugin-transform-dynamic-import',
    '@babel/plugin-transform-async-generator-functions',
    '@babel/plugin-transform-logical-assignment-operators',
    '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-transform-export-namespace-from',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-class-static-block',
    '@babel/plugin-transform-json-strings'
  ],
};