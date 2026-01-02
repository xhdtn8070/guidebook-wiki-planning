import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^lucide-react$": "<rootDir>/__mocks__/lucide-react.ts",
    "^next/navigation$": "<rootDir>/__mocks__/next-navigation.ts",
  },
};

export default createJestConfig(config);
