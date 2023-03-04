import { writeFileSync } from 'fs'

export const saveTsFile = async (target: string, code: string) => {
    writeFileSync(target, code, 'utf-8')
    // await new Promise((yes) => setTimeout(yes, 100))
    // await Deno.run({ cmd: ['deno', 'fmt', target] }).status()
    // await new Promise((yes) => setTimeout(yes, 10))
}

export const saveJSONFile = async (target: string, object: object) => {
    Deno.writeTextFileSync(target, JSON.stringify(object, null, 4))
}