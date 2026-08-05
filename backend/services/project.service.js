import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';

export const createProject = async ({
    name, userId
}) => {
    if (!name) {
        throw new Error('Name is required')
    }
    if (!userId) {
        throw new Error('UserId is required')
    }

    let project;
    try {
        project = await projectModel.create({
            name,
            collaborators: [ { user: userId, role: 'Owner' } ]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }

    return project;

}


export const getAllProjectByUserId = async ({ userId, search }) => {
    if (!userId) {
        throw new Error('UserId is required')
    }

    const query = {
        'collaborators.user': userId
    };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { language: { $regex: search, $options: 'i' } }
        ];
    }

    const allUserProjects = await projectModel.find(query).sort({ lastOpenedAt: -1 });

    return allUserProjects
}

export const addUsersToProject = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }


    const project = await projectModel.findOne({
        _id: projectId,
        'collaborators.user': userId
    })

    console.log(project)

    if (!project) {
        throw new Error("User not belong to this project")
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            collaborators: {
                $each: users.map(id => ({ user: id, role: 'Editor' }))
            }
        }
    }, {
        new: true
    })

    return updatedProject



}

export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate('collaborators.user')

    return project;
}

export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })

    return project;
}

export const deleteProject = async ({ projectId, userId }) => {
    if (!projectId || !userId) throw new Error("projectId and userId are required");
    
    // Check permission (must be owner or at least part of the project depending on logic)
    const project = await projectModel.findOne({ _id: projectId, 'collaborators.user': userId });
    if (!project) throw new Error("Unauthorized or project not found");

    await projectModel.deleteOne({ _id: projectId });
    return true;
}

export const renameProject = async ({ projectId, name, userId }) => {
    if (!projectId || !name || !userId) throw new Error("projectId, name, and userId are required");
    
    const project = await projectModel.findOneAndUpdate(
        { _id: projectId, 'collaborators.user': userId },
        { name },
        { new: true }
    );
    if (!project) throw new Error("Unauthorized or project not found");
    return project;
}

export const duplicateProject = async ({ projectId, userId }) => {
    if (!projectId || !userId) throw new Error("projectId and userId are required");
    
    const project = await projectModel.findOne({ _id: projectId, 'collaborators.user': userId });
    if (!project) throw new Error("Unauthorized or project not found");

    const duplicatedProject = await projectModel.create({
        name: `${project.name} (Copy)`,
        description: project.description,
        language: project.language,
        collaborators: [ { user: userId, role: 'Owner' } ],
        fileTree: project.fileTree
    });

    return duplicatedProject;
}

export const removeUserFromProject = async ({ projectId, targetUserId, requestingUserId }) => {
    if (!projectId || !targetUserId || !requestingUserId) {
        throw new Error("projectId, targetUserId, and requestingUserId are required");
    }

    const project = await projectModel.findOne({ _id: projectId });
    if (!project) {
        throw new Error("Project not found");
    }

    const requestingUserCollab = project.collaborators.find(c => c.user.toString() === requestingUserId);
    if (!requestingUserCollab || (requestingUserCollab.role !== 'Owner' && requestingUserId !== targetUserId)) {
        throw new Error("Unauthorized to remove this user");
    }

    const updatedProject = await projectModel.findOneAndUpdate(
        { _id: projectId },
        {
            $pull: {
                collaborators: { user: new mongoose.Types.ObjectId(targetUserId) }
            }
        },
        { new: true }
    ).populate('collaborators.user');

    return updatedProject;
}