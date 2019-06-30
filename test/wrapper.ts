
import { writeFileSync } from "fs";

export function before( )
{
	writeFileSync( < string >process.env.OUTFILE, "before\n", { flag: "a" } );
}

export function after( )
{
	writeFileSync( < string >process.env.OUTFILE, "after\n", { flag: "a" } );
}
