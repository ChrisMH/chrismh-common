// Karma configuration
// Generated on Wed Jul 05 2017 15:17:15 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

      frameworks: ['jasmine', 'karma-typescript'],

      files: [
          { pattern: 'src/**/*.ts' }
      ],

      preprocessors: {
          '**/*.ts': ['karma-typescript']
      },

      reporters: ['progress', 'karma-typescript'],

      browsers: ['Chrome']
  })
}
