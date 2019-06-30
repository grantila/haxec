import * as foreground from "foreground-child";
import * as sw from "spawn-wrap";

import * as fs from "fs";
import * as path from "path";


export interface Options
{
	beforeExit?: ( ) => void | Promise< void >;
	env?: { [ key: string ]: string | undefined; };
}

export function run(
	wrapModule: string,
	cmd: Array< string >,
	options: Options = { }
)
: void
{
	const { env = { }, beforeExit } = options;

	const [ prog, ...progArgs ] = ensureExecutable( cmd );

	const wrapFile = path.join( __dirname, "wrap.js" );
	const unwrap = sw( [ wrapFile ], { ...env, __WRAP_CMD__: wrapModule } );

	foreground( prog, progArgs, async ( done: ( ) => void ) =>
	{
		if ( beforeExit )
			await beforeExit( );

		done( );
		unwrap( );
	} );
}

function makeAbsolute( file: string, dir = process.cwd( ) )
{
	return path.isAbsolute( file ) ? file : path.join( dir, file );
}

// Ensures that args[ 0 ] isn't a .js file, but an executable script (or node).
function ensureExecutable( args: Array< string > ): Array< string >
{
	const nodeJs = process.argv[ 0 ];

	const [ prog, ...progArgs ] = args;

	if ( !prog )
		throw new Error( "No command specified" );

	const asFile = makeAbsolute( prog, process.cwd( ) );
	const asDirectory = makeAbsolute(
		path.join( prog, "index.js" ), process.cwd( ) );

	if ( isNonExecutable( asFile ) || isNonExecutable( asDirectory ) )
		return [ nodeJs, prog, ...progArgs ];

	return args;
}

function isNonExecutable( file: string )
{
	try
	{
		fs.accessSync( file, fs.constants.R_OK );
	}
	catch ( err )
	{
		return false;
	}

	try
	{
		fs.accessSync( file, fs.constants.X_OK );
		return false;
	}
	catch ( err )
	{
		return true;
	}
}
