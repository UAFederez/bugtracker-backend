const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Version = require("../models/Version");

router.get("/", async (request, response) => {
    try {
        const versions = await Version.find({});
        response.status(200).send(versions);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const version = await Version.findById(request.params.id);
        if (!version) {
            response.status(404).send({ message: "version not found" });
        }
        response.status(200).send(version);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

router.get("/byProject/:id", async (request, response) => {
    try {
        const versions = await Version.find({ projectId: request.params.id });
        if (!versions) {
            response.status(404).send({ message: "version not found" });
        }
        response.status(200).send(versions);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

router.post("/new", async (request, response) => {
    try {
        const existingVersion = await Version.findOne({
            projectId: request.body.projectId,
            major: request.body.major,
            minor: request.body.minor,
            patch: request.body.patch,
        });

        if (existingVersion) {
            response.status(403).send({
                message: "Version already exists",
            });
        } else {
            console.log("Adding new version");
            const newVersion = new Version({
                projectId: request.body.projectId,
                major: request.body.major,
                minor: request.body.minor,
                patch: request.body.patch,
                releaseDate: request.body.releaseDate,
            });

            await newVersion.save();
            response.status(201).send(newVersion);
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

router.put("/update/:id", async (request, response) => {
    try {
        const existingVersion = await Version.findById(request.params.id);
        if (!existingVersion) {
            response.status(404).send({ message: "Version not found" });
        }

        if (request.body.hasOwnProperty("projectId")) {
            const newProject = Project.findById(request.body.projectId);
            if (!newProject) {
                response
                    .status(404)
                    .send({ message: "Could not find project!" });
            }
            existingVersion.projectId = newProject._id;
        }
        if (request.body.hasOwnProperty("major")) {
            existingVersion.major = request.body.major;
        }
        if (request.body.hasOwnProperty("minor")) {
            existingVersion.minor = request.body.minor;
        }
        if (request.body.hasOwnProperty("patch")) {
            existingVersion.patch = request.body.patch;
        }
        if (request.body.hasOwnProperty("releaseDate")) {
            existingVersion.releaseDate = request.body.releaseDate;
        }

        await existingVersion.save();
        response.status(200).send(existingVersion);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

router.delete("/delete/:id", async (request, response) => {
    try {
        const existingVersion = await Version.findById(request.params.id);
        if (!existingVersion) {
            response.status(404).send({ message: "Version not found" });
        } else {
            await Version.deleteOne({ _id: existingVersion._id });
            response
                .status(200)
                .send({ message: "sucessfully deleted Version" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

module.exports = router;
