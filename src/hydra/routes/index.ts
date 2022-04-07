import express from 'express'

const router = express.Router()

router.get('/', (req, res) => { // The first page [?]
  res.render('index')
  // res.render('login')
})

export default router
