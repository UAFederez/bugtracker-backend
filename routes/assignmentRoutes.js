const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const Ticket = require("../models/Ticket");

router.get("/", async (request, response) => {
    try {
        const assignments = Assignment.find({});
        response.status(200).send(assignments);
    } catch (error) {
        response.status(500).send(error);
        console.error(error);
    }
});
router.get("/byDeveloper/:id", async (request, response) => {
    try {
        const assignments = Assignment.find({ developerId: request.params.id });
        response.status(200).send(assignments);
    } catch (error) {
        response.status(500).send(error);
        console.error(error);
    }
});
router.get("/byProject/:id", async (request, response) => {
    try {
        const TicketsOfProject = Ticket.find({
            projectId: request.params.id,
        }).select("_id");
        const assignments = Assignment.find({ ticketId: TicketsOfProject });
        response.status(200).send(assignments);
    } catch (error) {
        response.status(500).send(error);
        console.error(error);
    }
});
router.get("/byTicket/:id", async (request, response) => {
    try {
        const assignments = Assignment.find({ ticketId: request.params.id });
        response.status(200).send(assignments);
    } catch (error) {
        response.status(500).send(error);
        console.error(error);
    }
});

router.post("/new", async (request, response) => {
    try {
        const existingAssignment = Assignment.find({
            developerId: request.body.developerId,
            ticketId: request.body.ticketId,
        });

        if (existingAssignment) {
            response.status(403).send({ message: "Assignment already exists" });
        } else {
            const newAssignment = new Assignment({
                developerId: request.body.developerId,
                ticketId: request.body.ticketId,
            });
            await newAssignment.save();
            response.status(200).send(newAssignment);
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

router.put("/update/:id", async (request, response) => {
    try {
        const existingAssignment = Assignment.findById(request.params.id);
        if (!existingAssignment) {
            response.status(403).send({ message: "Assignment does not exist" });
        }
        if (request.body.hasOwnProperty("developerId")) {
            existingAssignment.developerId = request.body.developerId;
        }
        if (request.body.hasOwnProperty("ticketId")) {
            existingAssignment.ticketId = request.body.ticketId;
        }
        await existingAssignment.save();
        response.status(200).send(existingAssignment);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.delete("/delete/:id", async (request, response) => {
    try {
        const existingAssignment = Assignment.findById(request.params.id);
        if (!existingAssignment) {
            response.status(403).send({ message: "Assignment does not exist" });
        } else {
            await Assignment.deleteOne({ _id: existingAssignment._id });
            response
                .status(200)
                .send({ message: "Successfully deleted Assignment" });
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;
