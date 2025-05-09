module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  // collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"], // Adjust according to where your source code resides
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
