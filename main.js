
async function recognize(base64, lang, options) {
    const { utils } = options;
    const { run, cacheDir,} = utils;

    let result = await run(
        `p2t predict`, [
            "-i",
            `${cacheDir}/pot_screenshot_cut.png`,
            "-d",
            'cuda',
        ]
    )
    return result;
}
