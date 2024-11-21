const { exec } = require('child_process');

async function recognize(base64, lang, options) {
    const { utils } = options;
    const { cacheDir } = utils; // Corrected typo: cacheDiR -> cacheDir
    base64 = `data:image/png;base64,${base64}`;

    //  Save the base64 image to a file.  This is crucial for the command line tool to work.
    const fs = require('node:fs');
    const imagePath = `${cacheDir}/pot_screenshot_cut.png`;
    const buffer = Buffer.from(base64.split(',')[1], 'base64');

    try {
      fs.writeFileSync(imagePath, buffer);
    } catch (err) {
      console.error("Error writing image to file:", err);
      return { status: 500, error: "Failed to write image to disk", detail: err.message };
    }


    const command = `p2t predict -i ${imagePath} -d 'cuda'`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                //console.error(`exec error: ${error}`);  //Comment out for production.  Only use in development for debugging.
                resolve({ status: 500, error: "Command execution failed", detail: error.message, stderr }); // Return stderr for more context
            } else if (stderr) {
                //console.error(`stderr: ${stderr}`); //Comment out for production. Only use in development for debugging.
                resolve({ status: 400, error: "Command returned an error", detail: stderr }); //Handle stderr even if no error code returned from exec.
            } else {
                resolve({ status: 200, result: stdout.trim() }); // trim removes leading/trailing whitespace
            }
        });
    });
}
