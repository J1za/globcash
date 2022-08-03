const promptDirectory = require('inquirer-directory');

const reactComponentGenerator = () => ({
  description: 'Component generator',
  prompts: [
    {
      type: 'list',
      name: 'component',
      message: 'Component type',
      choices: ['Function', 'Class', 'Redux'],
      default: 0,
    },
    {
      type: 'list',
      name: 'base',
      message: 'Base directory',
      choices: ['features', 'shared'],
      default: 0,
    },
    {
      type: 'directory',
      name: 'directory',
      message: 'AsyncSelect directory',
      basePath: './src/features',
      when: (answers) => answers.base === 'features',
    },
    {
      type: 'directory',
      name: 'directory',
      message: 'AsyncSelect directory',
      basePath: './src/shared',
      when: (answers) => answers.base === 'shared',
    },
    {
      type: 'input',
      name: 'name',
      message: 'Component name',
    },
  ],
  actions: function (data) {
    return [
      {
        type: 'add',
        path: `src/${data.base}/{{directory}}/{{pascalCase name}}/{{pascalCase name}}.jsx`,
        templateFile: `plop-templates/component/${data.component === 'Class' ? 'Class' : ''}Component.hbs`,
      },
      {
        type: 'add',
        path: `src/${data.base}/{{directory}}/{{pascalCase name}}/{{pascalCase name}}.scss`,
        templateFile: 'plop-templates/component/Component.scss.hbs',
      },
      {
        type: 'add',
        path: `src/${data.base}/{{directory}}/{{pascalCase name}}/index.js`,
        templateFile: 'plop-templates/component/Component.index.hbs',
      },
      // For Redux & Saga
      {
        type: `${data.component === 'Redux' && 'add'}`,
        path: `src/${data.base}/{{directory}}/{{pascalCase name}}/{{camelCase name}}ActionTypes.js`,
        templateFile: 'plop-templates/component/reduxActionTypes.hbs',
      },
      {
        type: `${data.component === 'Redux' && 'add'}`,
        path: `src/${data.base}/{{directory}}/{{pascalCase name}}/{{camelCase name}}Actions.js`,
        templateFile: 'plop-templates/component/reduxActions.hbs',
      },
      {
        type: `${data.component === 'Redux' && 'add'}`,
        path: `src/${data.base}/{{directory}}/{{pascalCase name}}/{{camelCase name}}Reducer.js`,
        templateFile: 'plop-templates/component/reduxReducer.hbs',
      },
      {
        type: `${data.component === 'Redux' && 'add'}`,
        path: `src/${data.base}/{{directory}}/{{pascalCase name}}/{{camelCase name}}Saga.js`,
        templateFile: 'plop-templates/component/reduxSaga.hbs',
      },
    ];
  },
});

module.exports = function (plop) {
  plop.setPrompt('directory', promptDirectory);
  plop.setGenerator('Component generator', reactComponentGenerator());
};
