#!/usr/bin/env node

import prog from 'caporal';
const createCmd = require('./lib/create');

prog
  .version('1.0.0')
  .command('create', 'Create new application')
  .argument('<template>', 'Template to use')
  .option(
    '--variant <variant>',
    'Which <variant> of the template is going to be created'
  )
  .action(createCmd);

prog.parse(process.argv);
