const mongoose = require("mongoose")
const schema = mongoose.Schema({
    username : {
            type: String,
            required: true,

    },
    useremail : {
            type: String,
            required: true,
            unique: true,

},

}
)
module.exports = mongoose.model("User", schema)