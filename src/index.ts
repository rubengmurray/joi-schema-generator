import concatStream from 'concat-stream';
// @ts-ignore -- no types are available for joi-machine
import joiMachine from 'joi-machine';
import jsBeautify from 'js-beautify';
import fs from 'fs';

interface GenericStringKeyObject { [key: string]: unknown }
interface GenericNumberKeyObject { [key: number]: unknown }
interface CreateSchemaOptions {
  stdOut: boolean;
  fileNameAndPath: string;
}

let stdOut: boolean | undefined;
let fileNameAndPath: string | undefined;

// Callback function to prettify the output
const handleOutput = (data: Buffer) => {
  const beautifiedJoiSchema = jsBeautify(data.toString())

  if (stdOut) {
    console.log(beautifiedJoiSchema);
  }

  if (fileNameAndPath) {
    fs.writeFileSync(fileNameAndPath, beautifiedJoiSchema)
  }
}

// Generate the joi schema from an incoming object
export const generateSchema = async (objToSchemify: GenericStringKeyObject | GenericNumberKeyObject, options?: CreateSchemaOptions) => {
  stdOut = options?.stdOut
  fileNameAndPath = options?.fileNameAndPath

  const generator = joiMachine.obj()
  generator.pipe(concatStream({ encoding: 'string' }, handleOutput))
  generator.write(objToSchemify)
  generator.end()
}
