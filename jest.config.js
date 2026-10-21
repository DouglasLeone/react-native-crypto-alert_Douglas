process.env.EXPO_PUBLIC_USE_RN_FETCH = "1";

module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@screens/(.*)$": "<rootDir>/src/screens/$1",
    "^@context/(.*)$": "<rootDir>/src/context/$1",
    "^@theme/(.*)$": "<rootDir>/src/theme/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@assets/(.*)$": "<rootDir>/assets/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  },
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
