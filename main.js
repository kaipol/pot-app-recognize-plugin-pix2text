async function recognize(base64, lang, options) {
    const {config, utils } = options;
    const { run, cacheDir, pluginDir } = utils;
    let {device} = config;
    
    if (device == null) {
        device = "cpu"; 
    } else {
        device = String(device);
    }
    
    let result = await run(`${pluginDir}/p2t.exe`, [
        "predict",
        "-i",
        `${cacheDir}/pot_screenshot_cut.png`,
        "-l",
        lang,
        "-d",
        device,
        "--save-debug-res",
        `${cacheDir}/pot_screenshot_cut.png-result.jpg`,
    ]);
    
    if (result.status === 0) {
        let out = result.stdout;
        out = out.split("Outs:\n");
        if (out.length > 1) {
            return out[1].trim();
        } else {
            throw Error("Output does not contain 'Outs:\\n'");
        }
    } else {
        throw Error(result.stderr);
    }
}
