
import { writeFileSync } from "fs"
import { run } from "../"
import * as path from "path"

run(
	path.join( __dirname, "wrapper.js" ),
	[ path.join( __dirname, "testprog.js" ), ...process.argv.slice( 2 ) ],
	{
		env: process.env,
		beforeExit( )
		{
			writeFileSync(
				< string >process.env.OUTFILE,
				"beforeExit\n",
				{ flag: "a" }
			);
		},
	}
);
