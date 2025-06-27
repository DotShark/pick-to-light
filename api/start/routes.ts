/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const FloorsController = () => import('#controllers/floors_controller')
const ItemsController = () => import('#controllers/items_controller')
const ShelvesController = () => import('#controllers/shelves_controller')
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/', async () => {
  return {
    message: 'Welcome to PickToLight REST API, you can see the docs at /docs',
  }
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

router
  .group(() => {
    router.get('/', [ShelvesController, 'index'])
    router.post('/', [ShelvesController, 'store'])
    router.get('/:id', [ShelvesController, 'show'])
    router.patch('/:id', [ShelvesController, 'update'])
    router.delete('/:id', [ShelvesController, 'destroy'])
  })
  .prefix('/shelves')

router
  .group(() => {
    router.get('/', [FloorsController, 'index'])
    router.post('/', [FloorsController, 'store'])
    router.get('/:id', [FloorsController, 'show'])
    router.patch('/:id', [FloorsController, 'update'])
    router.delete('/:id', [FloorsController, 'destroy'])
  })
  .prefix('/floors')

router
  .group(() => {
    router.get('/', [ItemsController, 'index'])
    router.post('/', [ItemsController, 'store'])
    router.get('/:id', [ItemsController, 'show'])
    router.patch('/:id', [ItemsController, 'update'])
    router.delete('/:id', [ItemsController, 'destroy'])
  })
  .prefix('/items')
