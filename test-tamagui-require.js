const { register } = require('esbuild-register/dist/node');
register();
try {
  const config = require('./tamagui.config.ts');
  console.log("Success");
} catch (e) {
  console.error(e);
}
