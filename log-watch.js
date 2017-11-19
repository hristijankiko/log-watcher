const fs = require("fs");
let changes = 0;
let text = "";

// Make sure filename is provided
if (!process.argv[2]) {
  console.error("Must specify a valid file name");
  return;
}

// Check if file is accessible for reading
try {
  console.log(fs.accessSync(process.argv[2], fs.constants.access | fs.constants.R_OK));  
} catch (error) {
  if(error.code == 'ENOENT') {
    console.log(`${process.argv[2]} does not exist`);
  } else {
    console.log(`Cannot read access or read file`);
  }
  return;
}

// Watch
try {
fs.watch(process.argv[2], null, function(event, filename) {
  // Change event gets called twice for some reason on windows
  if (event === "change" && changes === 1) {
    changes = 0;
    return;
  } else {
    changes++;
  }

  if (event === "change") {
    fs.readFile(process.argv[2], (err, data) => {
      let utfData = data.toString('utf-8');
      let diff = diffText(text, utfData);
      if(diff) console.log(diff);
      text = utfData;
    });
  }

});
} catch (error) {
  console.log(error);
}

function diffText(oldText, newText) {
  let ol = oldText.length;
  let nl = newText.length;
  let result = '';
  for(let i = 0; i < nl; i++) {
    if(oldText.charAt(i) != newText.charAt(i)) {
      result += newText.charAt(i);
    }
  };

  return result;
}