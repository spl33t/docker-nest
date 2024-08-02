import { FileTypes} from "../file-types"
 
export type CreateFileDto = {
    type: FileTypes
    relationId: string
    files: File[]
}


