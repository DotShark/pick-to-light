import vine from '@vinejs/vine'

export const createItemValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    color: vine.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    floorId: vine.number().positive(),
  })
)

export const updateItemValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    color: vine.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    floorId: vine.number().positive().optional(),
  })
)