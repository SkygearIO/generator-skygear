'use strict';
const path = require('path');
const fs = require('fs');
const esprima = require('esprima');
const eWalk = require('esprima-walk');
const escodegen = require('escodegen');

const Generator = require('yeoman-generator');
const packageInfo = require('../package.json');


class SkygearGenerator extends Generator {

  constructor(args, options) {
    super(args, options);
    //this.argument('appname', { type: String, required: true });
  }

  initializing() {
    this.log('Welcome to skygear!');
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'endPoint',
      message: 'What is your skygear endpoint? (You can find it in portal)',
      default: 'https://myapp.skygeario.com/'
    }, {
      type: 'input',
      name: 'apiKey',
      message: 'What is your skygear API key (You can find it in portal)',
      default: 'dc0903fa85924776baa77df813901efc'
    }, {
      type: 'confirm',
      name: 'chatSDK',
      message: 'Do you want to install Skygear Chat extension? (The core SDK already got Auth, CloudDB, Push and Pubsub)',
      default: true
    }]).then((answers) => {
      this.appName = answers.appName;
      this.endPoint = answers.endPoint;
      this.apiKey = answers.apiKey;
      this.chatSDK = answers.chatSDK;
      this.generatedWithVersion = parseInt(packageInfo.version.split('.').shift(), 10);

      this.config.set('generatedWithVersion', this.generatedWithVersion);
    });
  }

  install() {

    if(!this.options['skip-install']) {
      this.installDependencies({ bower: false });
    }

    // Run the base react-webpack generator, then run the dispatcher
    this.composeWith(
      require.resolve('generator-react-webpack'),
      {
        options: {
          'skip-install': this.options['skip-install']
        }
      },
      {
        local: require.resolve('generator-react-webpack'),
        link: 'strong'
      }
    ).on('end', () => {
        /* Some base files need to be overwritten, so we force yeoman
         * to do so.
         */
      this.conflicter.force = true;

      this.fs.copy(
        this.templatePath('skygear.png'),
        this.destinationPath('src/images/skygear.png')
      );
      this.fs.copyTpl(
        this.templatePath('Main.js'),
        this.destinationPath('src/components/Main.js'),
        {
          endPoint: this.endPoint,
          apiKey: this.apiKey
        }
      );
      this.fs.copyTpl(
        this.templatePath('config.js'),
        this.destinationPath('src/config/base.js'),
        {
          endPoint: this.endPoint,
          apiKey: this.apiKey
        }
      );
      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath('src/index.js'),
        {
          endPoint: this.endPoint,
          apiKey: this.apiKey
        }
      );
      const skygearDeps = ['skygear@^1.6.0'];
      if (this.chatSDK) {
        skygearDeps.push('skygear-chat@^1.3.4');
      }
      this.npmInstall(skygearDeps, { save: true });
      this._addSkygearExternal();
    });
  }

  _addSkygearExternal() {
    // Add th required webpack config for skygear
    // Those externals are handled within the skygear package
    // externals: {
    //   'react-native': 'undefined',
    //   'websocket': 'undefined'
    // }
    //
    const cfgPath = this.destinationPath('cfg/base.js');
    const data = this.fs.read(
      cfgPath,
      'utf8'
    );
    let ast = esprima.parse(data, {
      sourceType: 'module',
      range: true,
      tokens: true,
      comment: true
    });
    ast.body.map(function(node) {
      if (node.type == 'ExpressionStatement') {
          if (node.expression.left) {
            if (node.expression.left.property.name !== 'exports') {
                return;
            }
          }
          let cfg = node.expression.right;
          if (!cfg) return;

          cfg.properties.push({
            type: 'Property',
            kind: 'init',
            key: { type: 'Identifier', name: 'externals' },
            value: {
              type: 'ObjectExpression',
              properties: [{
                type: 'Property',
                kind: 'init',
                key: { type: 'Identifier', name: '\'react-native\'' },
                value: { type: 'Identifier', value: '\'undefined\'' }
              }, {
                type: 'Property',
                kind: 'init',
                key: { type: 'Identifier', name: '\'websocket\'' },
                value: { type: 'Identifier', name: '\'undefined\'' }
              }]
            }
          });
      }
    });
    ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
    const code = escodegen.generate(ast, {
      comment: true,
      format: { indent: { style: '  ' } }
    });
    this.fs.write(cfgPath, code);
  }
}

module.exports = SkygearGenerator;
