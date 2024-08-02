import { Logger } from "@nestjs/common"
//import { Prisma } from "@prisma/client"

const pictureExts = ["jpg", "png", "jpeg"]
export const fileTypesConfig = defineFileTypes({
    Work: {
        photos: {
            allowExt: ["png"],
            isMultiple: true
        },
    }
} as const)


export type ModelNamesWithFiles = keyof typeof fileTypesConfig
export const modelNamesWithFiles = Object.fromEntries(Object.keys(fileTypesConfig).map(s => {
    return [s, s]
})) as Record<ModelNamesWithFiles, ModelNamesWithFiles>

export type FileTypes = keyof {
    [Key in ModelNamesWithFiles as keyof typeof fileTypesConfig[Key]["fileTypes"] extends string ? `${Key}_${keyof typeof fileTypesConfig[Key]["fileTypes"]}` : never]: string
}
export const fileTypes = Object.fromEntries(Object.values(fileTypesConfig).map(s => {
    return Object.values(s.fileTypes)
}).flat().map(s => {
    return [s.fileTypeName, s]
})) as unknown as Record<FileTypes, FileTypeInstance>



type FileTypeConfig = {
    allowExt: string[],
    isMultiple: boolean,
}

type FileTypeInstance = FileTypeConfig & { fileTypeName: string }

type FileTypesInstance<T> = {
    [ModelName in keyof T]: {
    } & {
        modelName: ModelName, fileTypes: {
            [FileName in keyof T[ModelName]]: T[ModelName][FileName] & FileTypeInstance
        }
    }
}

// Ключи в объекте конфига это названия файлового типа. Важно сразу дать правильное имя. 
// Если есть потребность поменять ключ тогда надо его запомнить и обновить у всех файлов со старым type на новый 
export function defineFileTypes<T extends Partial<Record<any, Record<string, FileTypeConfig>>>>(config: T) {
    const reslut = { ...config }

    Object.keys(config).forEach(modelName => {
        const model = { modelName, fileTypes: {} } as Record<string, any>
        reslut[modelName] = model

        Object.keys(config[modelName]).forEach(fileTypeName => {
            reslut[modelName]["fileTypes"][fileTypeName] = { ...config[modelName][fileTypeName], fileTypeName: `${modelName}_${fileTypeName}` }
        })

    })
    return reslut as FileTypesInstance<T>
}





export function getFileType(fileTypeName: FileTypes) {
    const fileConfig = fileTypes[fileTypeName]
    if (!fileConfig) {
        throw Logger.error(`Некоректный тип файла`)
    }

    const parts = fileTypeName.split("_")
    const modelName = parts.shift() as ModelNamesWithFiles
    const type = parts[0]

    return {
        ...fileConfig,
        modelName,
        type
    }
}