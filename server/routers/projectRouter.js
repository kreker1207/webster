const Router = require('express')
const router = new Router()
const controller = require('../controllers/projectController')
const authMiddleware = require('../middleware/authMiddleware')
const {check} = require('express-validator')

router.get('/projects', controller.get);
router.get('/project/:id',controller.getById);
router.post('/project', authMiddleware, controller.saveProject);
router.post('/project/photo/:id',authMiddleware, controller.editPhoto);
router.delete('/project/:id', authMiddleware, controller.deleteProject);

module.exports = router