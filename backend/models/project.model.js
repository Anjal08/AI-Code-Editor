import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: [ true, 'Project name must be unique' ],
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    language: {
        type: String,
        trim: true,
        default: 'JavaScript'
    },
    lastOpenedAt: {
        type: Date,
        default: Date.now
    },
    collaborators: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            role: {
                type: String,
                enum: ['Owner', 'Editor', 'Viewer'],
                default: 'Editor'
            }
        }
    ],
    fileTree: {
        type: Object,
        default: {}
    },

})


const Project = mongoose.model('project', projectSchema)


export default Project;