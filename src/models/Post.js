const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

PostSchema.pre('remove', function() {
    return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key))
})

module.exports = mongoose.model('Post', PostSchema)