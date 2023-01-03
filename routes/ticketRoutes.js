const express = require("express");
const Project = require("../models/Project");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Version = require("../models/Version");

router.get("/", async (request, response) => {
    try {
        const tickets = await Ticket.find({}).populate(
            "reporterId",
            "_id firstName lastName email"
        );
        response.status(200).send(tickets);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});
router.get("/:id", async (request, response) => {
    try {
        const ticket = await Ticket.findById(request.params.id)
            .populate("reporterId", "_id firstName lastName email")
            .populate("projectId");
        if (!ticket) {
            response.status(404).send({ message: "No ticket with that ID" });
        } else {
            response.status(200).send(ticket);
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

router.get("/filter/:ticketFilter", async (request, response) => {
    const ticketFilter = request.params.ticketFilter;
    try {
        const tickets = await Ticket.find(ticketFilter);
        response.status(200).send(tickets);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

router.post("/new", async (request, response) => {
    try {
        const data = {
            versionId: request.body.versionId,
            projectId: request.body.projectId,
            reporterId: request.user._id,
            title: request.body.title,
            description: request.body.description,
            status: "Pending",
            severity: request.body.severity,
            dateSubmitted: Date.now(),
        };

        const newTicket = new Ticket(data);
        await newTicket.save();
        response.status(201).send(newTicket);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});
router.put("/:id", async (request, response) => {
    try {
        const existingTicket = await Ticket.findById(request.params.id);
        if (!existingTicket) {
            return response.status(404).send({ message: "Ticket not found" });
        }
        if (request.body.hasOwnProperty("versionId")) {
            const newVersion = await Version.findById(request.body.versionId);
            if (!newVersion) {
                return response
                    .status(404)
                    .send({ message: "Version not found" });
            }
            existingTicket.versionId = newVersion._id;
        }
        if (request.body.hasOwnProperty("projectId")) {
            const newProject = await Project.findById(request.body.projectId);
            if (!newProject) {
                return response
                    .status(404)
                    .send({ message: "Project not found" });
            }
            existingTicket.projectId = newProject._id;
        }
        const writableFields = ["title", "description", "status", "severity"];
        writableFields.forEach((field) => {
            if (request.body.hasOwnProperty(field)) {
                existingTicket[field] = request.body[field];
            }
        });

        existingTicket.dateUpdated = Date.now();
        await existingTicket.save();
        response.status(200).send(existingTicket);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});
router.delete("/delete/:id", async (request, response) => {
    try {
        const existingTicket = await Ticket.findById(request.params.id);
        if (!existingTicket) {
            response.status(404).send({ message: "Ticket does not exist." });
        } else {
            await existingTicket.remove();
            response
                .status(200)
                .send({ message: "Successfully deleted ticket" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
});

module.exports = router;
