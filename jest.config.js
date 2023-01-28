module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "jsx"
  ],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "\\.(css|less|css!)$": "<rootDir>/jest/empty-module.js"
  },
  testMatch: [
    "**/test/**/*.js?(x)",
    "<rootDir>/src/**/?(*.)+(spec|test).js?(x)"
  ],
  //   transform: {
  //     '.+\\.(css|css!|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
  //     'jest-transform-stub',
  //     '^.+\\.(js|jsx)?$': 'babel-jest'
  //   },
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules/", "<rootDir>/dist/*"
  ],
  transformIgnorePatterns: [`/node_modules/(?!(sip\.js))`],
  // preset: 'ts-jest',
  transform: {
    // '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }
};