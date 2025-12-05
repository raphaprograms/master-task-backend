const mongoose = require('mongoose');



const projectSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    name: {
        type: String,
        required: true
     },
     description: {
        type: String,
        required: true
     }
});


const Project = mongoose.model('Project', projectSchema);
module.exports = Project;








// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const projectSchema = new mongoose.Schema({
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     }
// });

// const Project = mongoose.model("Project", projectSchema);

// module.exports = Project;