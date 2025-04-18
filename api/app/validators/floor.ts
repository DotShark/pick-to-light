import vine from '@vinejs/vine'

export const createFloorValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    shelfId: vine.number().positive(),
  })
)

export const updateFloorValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    shelfId: vine.number().positive().optional(),
  })
)