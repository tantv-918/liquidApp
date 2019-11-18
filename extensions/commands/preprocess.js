var path = require('path');
var { execScripts } = require('../helpers/_exec');

module.exports = {
  description: 'preprocess code',
  builder: (yargs) => {
    yargs
      .example('$0 preprocess helloworld');
  },
  command: 'preprocess <contract>',
  handler: async (args) => {
    await execScripts(path.resolve(__dirname, './preprocess'), (script) => {
      console.log('running preprocessor', path.basename(script));
      return [args];
    }, args);
  }
};
