const express = require("express");
const { requireUserIsAuth } = require("./authUtils");
const router = express.Router();
const Project = require("../models/Project");

// TODO:
// requireUserIsAuth to be included as middleware in all of these
// route handlers, but for testing purposes these will do for now

// Get all projects
router.get("/", async (request, response) => {
    try {
        const projects = await Project.find({});
        response.status(200).send(projects);
    } catch (error) {
        console.error(error);
        response.sendStatus(500);
    }
});

// Get project by id
router.get("/:id", async (request, response) => {
    try {
        const project = await Project.findById(request.params.id);
        if (!project) {
            response.status(404).send({ message: "Project not found" });
        } else {
            response.status(200).send(project);
        }
    } catch (error) {
        console.error(error);
        response.sendStatus(500);
    }
});

// Create project
router.post("/new", async (request, response) => {
    try {
        const newProject = new Project({
            name: request.body.name,
            description: request.body.description,
        });

        await newProject.save();
        response.status(201).send({ project: newProject });
    } catch (error) {
        response.status(403).send(error);
    }
});

// Update project
router.put("/update/:id", async (request, response) => {
    try {
        const project = await Project.findById(request.params.id);
        if (!project) {
            response.status(404).send({ message: "Project does not exist" });
        }
        if (request.body.hasOwnProperty("name")) {
            project.name = request.body.name;
        }
        if (request.body.hasOwnProperty("description")) {
            project.description = request.body.description;
        }

        await project.save();
        response.status(201).send({ project });
    } catch (error) {
        response.status(403).send(error);
    }
});

// Delete project
router.delete("/delete/:id", async (request, response) => {
    try {
        const project = await Project.findById(request.params.id);
        if (!project) {
            response.status(404).send({ message: "Project does not exist" });
        } else {
            await project.remove();
            response
                .status(200)
                .send({ message: "sucessfully deleted project" });
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;
