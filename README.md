[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][travis-image]][travis-url]
[![greenkeeper badge][greenkeeper-image]][greenkeeper-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]


# wrapcmd

Run a (JavaScript) program with *before* and *after* handlers inside the child process. The command can be either a `.js` file or a `node file.js [...]` command line, or a Node shebang script.

If the wrapped script spawns further sub processes, the wrapping will occur to these as well!

The invoked program will take over standard I/O and become foreground. When the invoked program exits, the parent exits too.


# API

## Interface

The interface for `wrapcmd` is a module exporting a function `run`:

```ts
const { run } = require( 'wrapcmd/register' );

// run is defined as:
function run(
  wrapModule: string,
  cmdWithArgs: Array< string >,
  options?: Options
): void;

// where options can contain environment variables in the "env" property:
interface Options
{
  env?: { [ key: string ]: string; };
  beforeExit?: ( ) => void | Promise< void >;
}
```

The `wrapModule` is *your* module (it will make sense to provide an absolut path to it) which `wrapcmd` will `require()`. This module is supposed to export a `before` function and/or a `after` function. The module will be injected into the command that is being run, so these functions will be called in that process.

`run` returns nothing. At this time, the program shouldn't do much else, as the child will take over terminal I/O and exit the parent when the child exits.

Environment variables can be added to the child, using the `env` property in the options object.

To perform any final/cleanup work right before the child has exited, provide a `beforeExit` callback. If this returns a promise, it will be awaited before exiting the child (and thereby the parent).


## Usage

```ts
const path = require( "path" );
const { run } = require( 'wrapcmd/register' );

const wrapModule = path.join( __dirname, "child.js" );

run( wrapModule, [ "node", "file.js", "arg1" ] );
// which is same as
run( wrapModule, [ "file.js", "arg1" ] );
// or as a shebang script
run( wrapModule, [ "./script-name.sh", "arg1" ] );
```


## Example

```ts
// main.js
const { run } = require( 'wrapcmd/register' );

run(
  path.join( __dirname, "child.js" ),
  [ "node", "some-app.js", "arg1" ],
  {
    env: { foo: "bar" }
  }
);
```

This will run `some-app.js` with `arg1` as argument. It will inject this file into it and call its hooks before and after `some-app.js` is invoked, inside its process:

```ts
// child.js
module.exports = {
  before( ) {
    console.log( "Child has pid", process.pid );
    // Inject an environment into this process
    process.env.injected = "yes";

    // When this function returns, the main "some-app.js" will run, and it
    // will have { foo: "bar", injected: "yes" } as environment variables.
  },
  after( code ) {
    console.log( "Child exited with code", code );
  },
};
```


[npm-image]: https://img.shields.io/npm/v/wrapcmd.svg
[npm-url]: https://npmjs.org/package/wrapcmd
[downloads-image]: https://img.shields.io/npm/dm/wrapcmd.svg
[travis-image]: https://img.shields.io/travis/grantila/wrapcmd/master.svg
[travis-url]: https://travis-ci.org/grantila/wrapcmd
[greenkeeper-image]: https://badges.greenkeeper.io/grantila/wrapcmd.svg
[greenkeeper-url]: https://greenkeeper.io/
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/wrapcmd.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/wrapcmd/context:javascript
