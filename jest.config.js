module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
