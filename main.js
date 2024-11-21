async function recognize(base64, lang, options) {
    const { utils } = options;
    const { run, cacheDir } = utils;
    base64 = `data:image/png;base64,${base64}`;

    //  Save the base64 image to a file. This is crucial for the command line tool to work.
    const fs = require("node:fs");
    const imagePath = `${cacheDir}/pot_screenshot_cut.png`;
    const buffer = Buffer.from(base64.split(",")[1], "base64");

    try {
        fs.writeFileSync(imagePath, buffer);
    } catch (err) {
        console.error("Error writing image to file:", err);
        return {
            status: 500,
            error: "Failed to write image to disk",
            detail: err.message,
        };
    }

    const command = `p2t predict -i ${imagePath} -d 'cuda' -l ${lang}`;

    try {
        const result = await run(command);
        // Assuming `run` returns an object with { stdout, stderr } or similar
        if (result.stderr) {
            //console.error(`stderr from run: ${result.stderr}`); //Comment out for production. Only use in development for debugging.
            return {
                status: 400,
                error: "Command returned an error",
                detail: result.stderr,
                stderr: result.stderr,
            };
        }
        return { result};
    } catch (error) {
        //console.error(`run error: ${error}`); //Comment out for production. Only use in development for debugging.
        return {
            status: 500,
            error: "Command execution failed",
            detail: error.message,
            stderr: error.stderr || null,
        };
    }
}
