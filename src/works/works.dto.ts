import { Prisma } from '@prisma/client';

export type CreateWorkDto = Pick<Prisma.WorkCreateInput, "name">
export type UpdateWorkDto = CreateWorkDto