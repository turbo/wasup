> If you are reading this on GitHub, please [visit the website](https://turbo.github.io/wasup/)

Wasup is a build server and CDN for single-page, portable and standalone C programs. Given programs are compiled to Web Assembly, without any modules (such as libc).

You can use this for quick wasm experiments or rapid prototyping on a machine that doesn't have wasm-llvm or emsdk installed. Don't use this for anything serious.

### Demo

This demo uses a modified version of [migerh's minimal wasm sample](https://github.com/migerh/wasm-filter/blob/master/filter.c). You need a webcam for this.

[&#128247; **Open Edge Detection Demo**](/wasup/demo)

### Quick Start Guide

In addition to normal JS, CSS, HTML and asset files, save your C programs in the same directory. You can take a look at this repo's demo dir to get an idea.

In your page, include wasup:

```html
<script src="//git.io/wasup"></script>
```

When needed, intialize the module(s) from files:

```js
wasmModule = await compileWASM('c/filter.c', false, {
  debug: msg => console.log(msg)
});
```

This will compile the source file. The second parameter tells wasup that this is a file to be `fetch`ed, not a string. The third parameter are callables (functions exported from JS). In order to use callables in your C code, you have to declare them.

In the C program, the first section should be the `WASM` macro. Let's take the demo's source file as an example:

```c
WASM(
    640 * 480 * 4 * 6,
    void debug(int msg);
)
```

- The first parameter is the size of memory in bytes that wasm should reserve. If this is missing, you will run into ArrayBuffer size errors.
- The second parameter is a list of functions imported from JS, with the signature to be used by wasm. Don't separate multiple functions with commas, just write them like you would any other code block. 

Now call functions defined in your C code by using the exports of the wasmModule.

Compile errors are logged to the console like any other exception:

![](http://imgur.com/xRDlTEW.png)
