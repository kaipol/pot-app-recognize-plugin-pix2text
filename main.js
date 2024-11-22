async function recognize(base64, lang, options) {
    const { utils } = options;
    const { run, cacheDir,pluginDir } = utils;
    let {device}=config;

    let result = await run(`${pluginDir}/p2t.exe predict`, [
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
        out = out.split("Outs:");
        out = out[1];
        return out.trim();
    } else {
        throw Error(result.stderr);
    }
}
