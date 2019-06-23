const routes = require('express').Router()
const multer = require('multer')
const multerConfig = require('./config/multer')
require('dotenv/config')

const Post = require('./models/Post')

routes.post('/create', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, filename: key } = req.file

    const post = await Post.create({
        name,
        size,
        key,
        url: `${process.env.APP_URL}files/${key}`
    })

    return res.json(post)
})

routes.get('/read', async (req, res) => {
    const post = await Post.find()

    return res.json(post)
})

routes.delete('/delete/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    await post.remove()
    
    return res.send()
})

module.exports = routes