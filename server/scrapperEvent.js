const chalk = require('chalk')
const readline = require('readline')
const {spawn} = require('child_process');
const { emit } = require('process');

let child

const start = () => {
  console.log(chalk.magenta('update stocks data process started'))
  const ls =  spawn('node',['scrapper.js'])
  ls.stdout.on('data', (data) => {
    if(''+data === 'finished'){
      return console.log(chalk.green(data))
    }
    console.log(`scraper: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
    console.error(chalk.red(`childError`));
    console.error(String(data));
  });
  
  ls.on('close', (code) => {
    child = null
    console.log(`child process exited with code ${code}`);
  });
  
  return ls
}

module.exports.start = start