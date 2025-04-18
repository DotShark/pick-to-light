import vine from '@vinejs/vine'

export const createShelfValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
  })
)

export const updateShelfValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
  })
)