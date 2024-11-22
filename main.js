async function recognize(base64, lang, options) {
    const { utils } = options;
    const { run, cacheDir } = utils;

    const imagePath = `${cacheDir}\\pot_screenshot_cut.png`;
    const command = `p2t predict -i ${imagePath} -d 'cuda' -l ${lang}`;

    try {
        const result = await run(command);

        if (result.stderr) {
            return {
                status: 400,
                error: "Command returned an error",
                detail: result.stderr,
                stderr: result.stderr,
            };
        }

        // Extract the output after "Outs\n"
        const outputStartIndex = result.stdout.indexOf("Outs\n");
        if (outputStartIndex === -1) {
            return {
                status: 400,
                error: "Unexpected output format: 'Outs\\n' not found",
                detail: result.stdout, // Include the full stdout for debugging
                stdout: result.stdout,
            };
        }

        const extractedOutput = result.stdout
            .substring(outputStartIndex + 5)
            .trim(); // +5 to skip "Outs\n"

        return { output: extractedOutput };
    } catch (error) {
        return {
            status: 500,
            error: "Command execution failed",
            detail: error.message,
            stderr: error.stderr || null,
        };
    }
}
