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
    ]);
    
    if (result.status === 0) {
        return result;
        let out = result.stdout;
        let outsIndex = out.indexOf("Outs:");
        if (outsIndex !== -1) {
            return out.substring(outsIndex + 5).trim();
        } else {
            throw Error("Output does not contain 'Outs:'");
        }
    } else {
        throw Error(result.stderr);
    }
}
