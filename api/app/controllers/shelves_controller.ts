import Shelf from '#models/shelf'
import type { HttpContext } from '@adonisjs/core/http'
import { createShelfValidator, updateShelfValidator } from '#validators/shelf'

export default class ShelvesController {
  /**
   * @index
   * @responseBody 200 - <Shelf[]>
   */
  async index({}: HttpContext) {
    const shelves = await Shelf.all()
    return shelves
  }

  /**
   * @store
   * @requestBody <createShelfValidator>
   * @responseBody 200 - <Shelf>
   * @responseBody 422 - {}
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createShelfValidator)
    const shelf = await Shelf.create(payload)
    return shelf
  }

  /**
   * @show
   * @responseBody 200 - <Shelf>
   * @responseBody 404 - {}
   */
  async show({ params }: HttpContext) {
    const shelf = await Shelf.findOrFail(params.id)
    return shelf
  }

  /**
   * @update
   * @requestBody <updateShelfValidator>
   * @responseBody 200 - <Shelf>
   * @responseBody 404 - {}
   * @responseBody 422 - {}
   */
  async update({ params, request }: HttpContext) {
    const shelf = await Shelf.findOrFail(params.id)
    const payload = await request.validateUsing(updateShelfValidator)

    shelf.merge(payload)
    await shelf.save()

    return shelf
  }

  /**
   * @destroy
   * @responseBody 200 - <Shelf>
   * @responseBody 404 - {}
   */
  async destroy({ params }: HttpContext) {
    const shelf = await Shelf.findOrFail(params.id)
    await shelf.delete()
    return shelf
  }
}