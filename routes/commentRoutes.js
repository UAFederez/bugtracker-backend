const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");

// Precondition:
// The comments array must be sorted in the order of the datePosted field. For
// the sake of simplicity, this is required for now such that by moving linearly
// through the array, it is always guaranteed that a parent comment has been
// encountered before a child comment.
function convertCommentsToTree(comments) {
    const topLevelComments = [];
    const commentParentMap = new Map();
    for (comment of comments) {
        if (!comment.parentId) {
            const topLevelComment = { comment, responses: [] };
            topLevelComments.push(topLevelComment);
            commentParentMap.set(comment._id.toString(), topLevelComment);
        } else {
            const childComment = { comment, responses: [] };
            const parent = commentParentMap.get(comment.parentId.toString());
            commentParentMap.set(comment._id.toString(), childComment);
            parent.responses.push(childComment);
        }
    }
    return topLevelComments;
}

router.get("/byTicket/:id", async (request, response) => {
    try {
        const commentsOfTicket = await Comment.find({
            ticketId: request.params.id,
        })
            .sort({ dateCreated: 1 })
            .populate("authorId", "_id firstName lastName email");

        const commentsAsTree = convertCommentsToTree(commentsOfTicket);
        response.status(200).send(commentsAsTree);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

router.get("/byAuthor/:id", async (request, response) => {
    try {
        const commentsOfAuthor = Comment.find({ authorId: request.params.id });
        response.status(200).send(commentsOfAuthor);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

router.post("/new", async (request, response) => {
    try {
        const newComment = new Comment({
            parentId: request.body.parentId,
            ticketId: request.body.ticketId,
            authorId: request.user._id,
            text: request.body.text,
            datePosted: Date.now(),
        });

        await newComment.save();
        response.status(200).send(newComment);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

router.delete("/delete/:id", async (request, response) => {
    try {
        const existingComment = Comment.findById(request.params.id);
        if (!existingComment) {
            response.status(404).send({ message: "Comment not found" });
        } else {
            await Comment.deleteOne({ _id: request.params.id });
            response
                .status(200)
                .send({ message: "Comment successfully deleted" });
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

module.exports = router;
