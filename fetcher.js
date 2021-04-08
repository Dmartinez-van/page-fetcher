const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);
const path = args[1];

request(args[0], (error, response, body) => {
  console.log('error: ', error);
  console.log('statusCode: ', response && response.statusCode);

  try {
    if (fs.existsSync(path)) {
      rl.question((`File already exists. Do you want to overwrite ${path} ? (y/n) `), (answer) => {
        if (answer === 'n') {
          process.exit();
        }
        fs.writeFile(path, body, (err) => {
          if (err) throw err;
          console.log(`Downloaded and saved ${body.length} bytes to ${path}`);
        });
        rl.close();
      });
    } else {
      console.log("Okay, no file existed, so I'll make a new one!");
      fs.writeFile(path, body, (err) => {
        if (err) throw err;
        console.log(`Downloaded and saved ${body.length} bytes to ${path}`);
        process.exit();
      });
    }
  } catch (err) {
    console.error(err);
  }
});