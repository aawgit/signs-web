module.exports = {
  extends: ["airbnb", "prettier", "react-app"],
  plugins: ["react"],
  rules: {
    "import/prefer-default-export": ["off"],
    "react/jsx-filename-extension": ["off"],
    "arrow-body-style": ["off"],
    "react-hooks/exhaustive-deps": ["warn"],
    "react/jsx-props-no-spreading": ["off"],
    "react/function-component-definition": [
      "warn",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/prop-types": ["warn"],
    "jsx-a11y/label-has-associated-control": ["off"],
  },
};
