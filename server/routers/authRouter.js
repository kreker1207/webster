const Router = require('express')
const router = new Router()
const controller = require('../controllers/authController')
const {check} = require('express-validator')

router.get('/profile', controller.profile)

router.post('/registration', [
    check('login',"Login could not be empty").notEmpty(),
    check('password', "Password should be no less than 4 and no longer that 16").isLength({min:4,max:16}),
    check('email',"Not valid email").isEmail()
] ,controller.registration)
router.get('/confirmEmail/:token', controller.confirmEmail)

router.post('/login',controller.login)
router.post('/logout',controller.logout)

module.exports = router