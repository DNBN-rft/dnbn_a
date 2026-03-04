const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// HTML 파일을 asset으로 포함
config.resolver.assetExts.push("html");

module.exports = config;
