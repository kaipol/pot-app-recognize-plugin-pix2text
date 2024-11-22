async function recognize(base64, lang, options) {
    const { utils } = options;
    const { run, cacheDir } = utils;

    //  Save the base64 image to a file. This is crucial for the command line tool to work.
    const imagePath = `${cacheDir}/pot_screenshot_cut.png`;

    const command = `p2t predict -i ${imagePath} -d 'cuda' -l ${lang}`;

    try {
        const result = await run(command);

        const outsMarker = "Outs:\n";
        const outsIndex = result.indexOf(outsMarker);

        if (outsIndex === -1) {
            // "Outs:" not found, handle the error appropriately
            return {
                status: 400,
                error: '"Outs:" not found in command output',
                detail: result,
            };
        }
        const output = result
            .substring(outsIndex + outsMarker.length)
            .trim();
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
        return { output };
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

//Example Usage (requires a mock utils object, including a mock run function):
const mockUtils = {
    run: async (command) => {
        // Mock implementation of run. Replace this with your actual run logic.
        return new Promise((resolve, reject) => {
            if (command.includes("fail")) {
                reject({
                    message: "Command failed (mocked)",
                    stderr: "Mocked stderr",
                });
            } else {
                resolve({ stdout: "Mocked output", stderr: "" });
            }
        });
    },
    cacheDir: "D:/download", // Replace with your actual cache directory
};

const exampleBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; //Example Base64 image

recognize(exampleBase64, "en", { utils: mockUtils })
    .then((response) => console.log(response))
    .catch((error) => console.error("Unhandled Promise Rejection:", error));
