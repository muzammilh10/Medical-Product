const express = require(`express`)
const router = express.Router()
const { login,
        signUp} = require(`./../controller/auth.controller`)


// usercontroller
router.post(`/signup`,signUp)
router.get(`/login`,login)

module.exports = router
