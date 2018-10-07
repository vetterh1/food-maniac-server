module.exports = function (api) {
  const presets = ["@babel/preset-env"];
  const plugins = ["@babel/plugin-proposal-class-properties"];

  api.cache(true)

  return {
    presets,
    plugins
  };
}