module.exports = function (api) {
  const presets = ["@babel/preset-env", "@babel/preset-react"];
  const plugins = ["@babel/plugin-proposal-class-properties"];

  api.cache(true)

  return {
    presets,
    plugins
  };
}