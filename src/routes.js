const routes = require('express').Router()
const fs = require('fs')
const pt = require('path')
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

routes.get('/video/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    console.log(post.key)
    const path = pt.resolve(__dirname, '..', 'tmp', 'uploads', post.key)

    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
  
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
  
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
  
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  })

module.exports = routes