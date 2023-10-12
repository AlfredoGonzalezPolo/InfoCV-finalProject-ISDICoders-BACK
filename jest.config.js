/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'src/app.ts',
    'src/config.ts',
    'src/db/db.connect.ts',
    'src/repository/user.mongo.model.ts',
    'src/routers/user.router.ts',
    'src/routers/curriculum.router.ts',
    'src/controllers/controller.ts',
    'src/repository/curriculum.mongo.model.ts',
  ],
};
