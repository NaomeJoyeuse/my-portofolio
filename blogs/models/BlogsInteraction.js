const mongoose = require("mongoose")
const interactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: function() { return this.type === 'comment'; }
    },
    type: {
        type: String,
        enum: ['like', 'comment','unlike'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("BlogsInteraction", interactionSchema);


// const mongoose = require("mongoose");

// const interactionSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     blogPost: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Post',
//         required: true
//     },
//     commentContent: {
//         type: String,
//         required: false
//     },
//     isLike: {
//         type: Boolean,
//         required: false,
//         default: false
//     },
//     isUnlike: {
//         type: Boolean,
//         required: false,
//         default: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model("BlogsInteraction", interactionSchema);
