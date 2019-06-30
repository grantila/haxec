import * as path from "path"
import * as os from "os"
import * as fs from "fs"
import { execFileSync } from "child_process"

describe( "wrapcmd", ( ) =>
{
	it( "should handle successful commands", async ( ) =>
	{
		const outfile = path.join( os.tmpdir(), "file-" + Math.random( ) );

		execFileSync(
			process.argv[ 0 ],
			[ path.join( __dirname, 'testparent.js' ), "arg1", "arg2" ],
			{
				env: { FOO: "bar", OUTFILE: outfile },
				stdio: 'inherit',
			}
		);

		const lines = fs.readFileSync( outfile, "utf8" )
			.split( "\n" )
			.filter( value => value );
		fs.unlinkSync( outfile );

		expect( lines ).toEqual( [
			"before",
			"main bar",
			"after",
			"beforeExit"
		] );
	} );

	it( "should handle commands which exits with non-zero", async ( ) =>
	{
		const outfile = path.join( os.tmpdir(), "file-" + Math.random( ) );

		let exitCode = 0;
		try
		{
			execFileSync(
				process.argv[ 0 ],
				[ path.join( __dirname, 'testparent.js' ), "arg1", "arg2" ],
				{
					env: { FOO: "bar", OUTFILE: outfile, DO_EXIT: '42' },
					stdio: 'inherit',
				}
			);
		}
		catch ( err )
		{
			exitCode = err.status;
		}

		const lines = fs.readFileSync( outfile, "utf8" )
			.split( "\n" )
			.filter( value => value );
		fs.unlinkSync( outfile );

		expect( exitCode ).toBe( 42 );
		expect( lines ).toEqual( [
			"before",
			"main bar",
			"after",
			"beforeExit"
		] );
	} );
} );
