import prompt from 'prompt';
import shell from 'shelljs';
import fs from 'fs';
import colors from 'colors/safe';

prompt.message = colors.green('Replace');

/**
 * command function
 */

module.exports = (args: any, options: any, logger: any) => {
  const variant = options.variant || 'default';
  const templatePath = `${__dirname}/../../templates/${args.template}/${variant}`;
  const localPath = process.cwd();

  /**
   * copy template
   */

  if (fs.existsSync(templatePath)) {
    logger.info('Copying files...');
    shell.cp('-R', `${templatePath}/*`, localPath);
    logger.info('✔️ The files have been copied!');
  } else {
    logger.error(`The requested template for ${args.template} wasn't found.`);
    process.exit(1);
  }

  /**
   * file variables
   */

  const variables = require(`${templatePath}/_variables`);

  if (fs.existsSync(`${localPath}/_variables.js`)) {
    shell.rm(`${localPath}/_variables.js`);
  }

  logger.info('Please fill the following values...');

  // Ask for variable values
  prompt.start().get(variables, (err: any, result: any) => {
    // if (result.license !== 'MIT') {
    //   shell.rm(`${localPath}/LICENSE`);
    // }

    shell.ls('-Rl', '.').forEach((entry: any) => {
      if (entry.isFile()) {
        // replace '[VARIABLE]' with the corresponding variable value from the prompt
        variables.forEach((variable: string) => {
          shell.sed(
            '-i',
            `\\[${variable.toUpperCase()}\\]`,
            result[variable],
            entry.name
          );
        });

        // insert current year in files
        shell.sed(
          '-i',
          '\\[YEAR\\]',
          new Date().getFullYear() as any,
          entry.name
        );
      }
    });
    logger.info('✔️ Success!');
  });
};
