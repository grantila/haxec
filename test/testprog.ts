
import { writeFileSync } from "fs";

writeFileSync(
	< string >process.env.OUTFILE,
	`main ${ process.env.FOO }\n`,
	{ flag: "a" }
);
