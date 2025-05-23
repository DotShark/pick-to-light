import type { HttpContext } from '@adonisjs/core/http'
import Floor from '#models/floor'
import { createFloorValidator, updateFloorValidator } from '#validators/floor'

export default class FloorsController {
  /**
   * @index
   * @responseBody 200 - <Floor[]>
   */
  async index({}: HttpContext) {
    const floors = await Floor.all()
    return floors
  }

  /**
   * @store
   * @requestBody <createFloorValidator>
   * @responseBody 200 - <Floor>
   * @responseBody 422 - {}
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createFloorValidator)
    const floor = await Floor.create(payload)
    return floor
  }

  /**
   * @show
   * @responseBody 200 - <Floor>
   * @responseBody 404 - {}
   */
  async show({ params }: HttpContext) {
    const floor = await Floor.query().where('id', params.id).preload('items').firstOrFail()
    return floor
  }

  /**
   * @update
   * @requestBody <updateFloorValidator>
   * @responseBody 200 - <Floor>
   * @responseBody 404 - {}
   * @responseBody 422 - {}
   */
  async update({ params, request }: HttpContext) {
    const floor = await Floor.findOrFail(params.id)
    const payload = await request.validateUsing(updateFloorValidator)

    floor.merge(payload)
    await floor.save()

    return floor
  }

  /**
   * @destroy
   * @responseBody 200 - <Floor>
   * @responseBody 404 - {}
   */
  async destroy({ params }: HttpContext) {
    const floor = await Floor.findOrFail(params.id)
    await floor.delete()
    return floor
  }
}
