async function recognize(base64, lang, options) {
    const { utils } = options;
    const { run, cacheDir } = utils;

    //  Save the base64 image to a file. This is crucial for the command line tool to work.
    const imagePath = `${cacheDir}/pot_screenshot_cut.png`;

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
