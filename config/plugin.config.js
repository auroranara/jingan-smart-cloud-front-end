// Change theme plugin

// const MergeLessPlugin = require('antd-pro-merge-less');
// const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
// const path = require('path');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const plugin = config => {
  // config.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin, [
  //   {
  //     debug: true,
  //   },
  // ]);
};

module.exports = plugin;
