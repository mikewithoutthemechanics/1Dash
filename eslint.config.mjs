import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      "unified-dashboard-service/**"
    ],
  },
];

export default eslintConfig;
