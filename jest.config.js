module.exports = {
  roots: ['<rootDir>/src/sise'], // Cambia <rootDir>./src a <rootDir>/src
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testRegex: '(/_tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$', // Asegúrate de que esté en 'tests' con dos guiones bajos (tests_)
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Cambia el patrón para que coincida con 'src'
  },
};