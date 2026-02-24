// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");

const config = getDefaultConfig(__dirname, {
    // [Web-only]: Enables CSS support in Metro.
    isCSSEnabled: true,
});

config.resolver.sourceExts.push("mjs");

// Node ≥24 breaks Tamagui static extraction (esbuild-register ESM/CJS interop issue)
const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);

module.exports = withTamagui(config, {
    components: ["tamagui"],
    config: "./tamagui.config.ts",
    outputCSS: "./tamagui-web.css",
    disableExtraction: nodeMajor >= 24,
});
