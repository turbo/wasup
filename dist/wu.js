/**
 * @author github.com/turbo
 * @param {string} file - Path to source file or source text, if ...
 * @param {*} dynamic - ... this is true
 * @param {*} sharedEnv - Exported JS closures
 */
async function compileWASM(file, dynamic = false, sharedEnv = {}) {
    if (!dynamic) { 
        sourceFile = await fetch(file);
        sourceText = await sourceFile.text();
    } else sourceText = file; 

    sourceText = '#define WASM(m, ...) unsigned char __wasmm[m]={0};__VA_ARGS__\n\n' + sourceText;
    
    const compileReq = await fetch('https://wasup.turbo.run', {
        method: "POST",
        body: JSON.stringify({src: sourceText})
    }),
    wasmFile = await compileReq.arrayBuffer();

    try {       
        const compiledModule = await WebAssembly.compile(wasmFile),
        wasmModule = await WebAssembly.instantiate(compiledModule, { env: sharedEnv });
        return wasmModule.exports;
    } catch (e) {
        console.log('Error compiling!', e);
        errObj = JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array((wasmFile))));
        throw '\nERROR in ' + file + ' (' + errObj.error.code + '):\n' + errObj.error.message;
    }
}