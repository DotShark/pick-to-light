import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'
import { createItemValidator, updateItemValidator } from '#validators/item'

export default class ItemsController {
  /**
   * @index
   * @responseBody 200 - <Item[]>
   */
  async index({}: HttpContext) {
    const items = await Item.all()
    return items
  }

  /**
   * @store
   * @requestBody <createItemValidator>
   * @responseBody 200 - <Item>
   * @responseBody 422 - {}
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createItemValidator)
    const item = await Item.create(payload)
    return item
  }

  /**
   * @show
   * @responseBody 200 - <Item>
   * @responseBody 404 - {}
   */
  async show({ params }: HttpContext) {
    const item = await Item.findByOrFail(params.id)
    return item
  }

  /**
   * @update
   * @requestBody <updateItemValidator>
   * @responseBody 200 - <Item>
   * @responseBody 422 - {}
   * @responseBody 404 - {}
   */
  async update({ params, request }: HttpContext) {
    const item = await Item.findByOrFail(params.id)
    const payload = await request.validateUsing(updateItemValidator)

    item.merge(payload)
    await item.save()

    return item
  }

  /**
   * @destroy
   * @responseBody 200 - <Item>
   * @responseBody 404 - {}
   */
  async destroy({ params }: HttpContext) {
    const item = await Item.findByOrFail(params.id)
    await item.delete()
    return item
  }
}
