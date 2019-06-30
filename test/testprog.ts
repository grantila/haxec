
import { writeFileSync } from "fs";

writeFileSync(
	< string >process.env.OUTFILE,
	`main ${ process.env.FOO }\n`,
	{ flag: "a" }
);

if ( process.env.DO_EXIT )
	process.exit( parseInt( process.env.DO_EXIT, 10 ) );
