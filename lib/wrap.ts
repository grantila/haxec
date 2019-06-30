import { existsSync } from "fs";
import { runMain } from "spawn-wrap";

const moduleName = process.env.__WRAP_CMD__;
delete process.env.__WRAP_CMD__;

function die( msg: string ): never
{
	console.log( msg );
	console.error( msg );
	return process.exit( 1 );
}

if ( moduleName == null )
	die( "Invalid usage of <wrapcmd>, no wrap module provided!" );
if ( !existsSync( < string >moduleName ) )
	die(
		`Invalid usage of <wrapcmd>, no wrap module ${moduleName} not found!`
	);

const { before, after } = require( < string >moduleName );

before && typeof before === 'function' && before( );

process.on( "exit", code =>
{
	after && typeof after === 'function' && after( code );
} );

runMain( );
