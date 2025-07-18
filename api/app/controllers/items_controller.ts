import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'
import { createItemValidator, updateItemValidator } from '#validators/item'
import { ItemsMqttMessage, mqttService } from '#services/mqtt_service'

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

    const message: ItemsMqttMessage = { action: 'reloadItems' }
    await mqttService.publishToFloor(item.floorId, message)

    return item
  }

  /**
   * @show
   * @responseBody 200 - <Item>
   * @responseBody 404 - {}
   */
  async show({ params }: HttpContext) {
    const item = await Item.findOrFail(params.id)
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
    const item = await Item.findOrFail(params.id)
    const payload = await request.validateUsing(updateItemValidator)

    let itemHasBreakingChanges = false
    if ((payload.slot || payload.slot === 0) && payload.slot !== item.slot)
      itemHasBreakingChanges = true
    if ((payload.floorId || payload.floorId === 0) && payload.floorId !== item.floorId)
      itemHasBreakingChanges = true

    const colorChanged = payload.color && payload.color !== item.color

    item.merge(payload)
    await item.save()

    if (itemHasBreakingChanges) {
      const message: ItemsMqttMessage = { action: 'reloadItems' }
      await mqttService.publishToFloor(item.floorId, message)
    }
    if (colorChanged && item.slot !== null && !itemHasBreakingChanges) {
      const message: ItemsMqttMessage = {
        action: 'changeItemColor',
        params: { slot: item.slot, color: item.color },
      }
      await mqttService.publishToFloor(item.floorId, message)
    }

    return item
  }

  /**
   * @destroy
   * @responseBody 200 - <Item>
   * @responseBody 404 - {}
   */
  async destroy({ params }: HttpContext) {
    const item = await Item.findOrFail(params.id)
    await item.delete()

    const message: ItemsMqttMessage = { action: 'reloadItems' }
    await mqttService.publishToFloor(item.floorId, message)

    return item
  }
}
