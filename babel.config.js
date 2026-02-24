// Node ≥24 has stricter ESM/CJS interop that breaks Tamagui's static extractor
// (esbuild-register can't require() the @tamagui/core CJS bundle).
// The crash happens at module load time (requireTamaguiCore), before any
// disableExtraction check, so the only fix is to omit the plugin entirely.
const nodeMajor = parseInt(process.versions.node.split(".")[0], 10);
const skipTamaguiBabelPlugin = nodeMajor >= 24;

module.exports = function (api) {
    api.cache(true);

    const plugins = [];

    if (!skipTamaguiBabelPlugin) {
        plugins.push([
            "@tamagui/babel-plugin",
            {
                components: ["tamagui"],
                config: "./tamagui.config.ts",
                logTimings: true,
                disableExtraction: process.env.NODE_ENV === "development",
            },
        ]);
    }

    // NOTE: this is only necessary if you are using reanimated for animations
    plugins.push("react-native-reanimated/plugin");

    return {
        presets: ["babel-preset-expo"],
        plugins,
    };
};
