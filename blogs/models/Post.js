const mongoose = require("mongoose")
const interactionSchema = require("./BlogsInteraction");
    
    const schema = mongoose.Schema({
        title : {
                type: String,
                required: true,

        },
        content : {
                type: String,
                required: true,
    },
    image: {
        type: String,
        default: '' 
    },
    public_id: {
        type: String,
    
    }, date : {

        type: Date,
        default: Date.now,        
    },
    author : {
        type: String,
    },
    interactions: [interactionSchema.schema]

}
)
    
    module.exports = mongoose.model("Post", schema)