import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';


export const createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }



}

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const { search } = req.query;

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id,
            search
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });
        
        // Update lastOpenedAt
        if (project) {
            project.lastOpenedAt = new Date();
            await project.save();
        }

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const toggleStarProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const user = await userModel.findOne({ email: req.user.email });

        const isStarred = user.starredProjects.includes(projectId);
        
        if (isStarred) {
            user.starredProjects = user.starredProjects.filter(id => id.toString() !== projectId);
        } else {
            user.starredProjects.push(projectId);
        }

        await user.save();
        res.status(200).json({ starredProjects: user.starredProjects });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        await projectService.deleteProject({ projectId, userId: loggedInUser._id });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const renameProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId } = req.params;
        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await projectService.renameProject({ projectId, name, userId: loggedInUser._id });
        res.status(200).json({ project });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const duplicateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const duplicatedProject = await projectService.duplicateProject({ projectId, userId: loggedInUser._id });
        res.status(201).json(duplicatedProject);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}