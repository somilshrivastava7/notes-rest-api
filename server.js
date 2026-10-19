import express from "express";

const app = express();
app.use(express.json());

let notes = [
    {
        id: 1,
        title: "Project Reminders",
        content: "Review API payload specifications and complete documentation.",
        isFavorite: false,
        createdAt: "2026-10-15T14:32:00Z",
        updatedAt: "2026-10-15T14:32:00Z"
    }
];

let nextId = notes.length > 0 ? notes.at(-1).id + 1 : 1;

// GET all notes
app.get("/notes", (req, res) => {
    return res.status(200).json(notes);
});

// GET a single note
app.get("/notes/:id", (req, res) => {
    const noteID = Number(req.params.id);

    if (!Number.isInteger(noteID) || noteID <= 0) {
        return res.status(400).json({
            message: "ID must be a positive integer"
        });
    }

    const findNote = notes.find((note) => note.id === noteID);

    if (!findNote) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    return res.status(200).json(findNote);
});

app.post("/notes", (req, res) => {
    const { title, content, isFavorite = false } = req.body;

    if (
        typeof title !== "string" ||
        title.trim() === "" ||
        typeof content !== "string" ||
        content.trim() === "" ||
        typeof isFavorite !== "boolean"
    ) {
        return res.status(400).json({
            message: "Valid title, content, and boolean isFavorite are required"
        });
    }

    const now = new Date();

    const newNote = {
        id: nextId++,
        title: title.trim(),
        content: content.trim(),
        isFavorite,
        createdAt: now,
        updatedAt: now
    };

    notes.push(newNote);

    return res.status(201).json(newNote);
});

// DELETE a note
app.delete("/notes/:id", (req, res) => {
    const noteID = Number(req.params.id);

    if (!Number.isInteger(noteID) || noteID <= 0) {
        return res.status(400).json({
            message: "ID must be a positive integer"
        });
    }

    const findNote = notes.find((note) => note.id === noteID);

    if (!findNote) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    notes = notes.filter((note) => note.id !== noteID);

    return res.status(200).json({
        message: `Successfully deleted note ${noteID}`
    });
});

// UPDATE a note
app.put("/notes/:id", (req, res) => {
    const noteID = Number(req.params.id);

    if (!Number.isInteger(noteID) || noteID <= 0) {
        return res.status(400).json({
            message: "ID must be a positive integer"
        });
    }

    const findNote = notes.find((note) => note.id === noteID);

    if (!findNote) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    const { title, content, isFavorite } = req.body;

    if (
        title === undefined &&
        content === undefined &&
        isFavorite === undefined
    ) {
        return res.status(400).json({
            message: "Provide at least one field to update"
        });
    }

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                message: "Title must be a non-empty string"
            });
        }
        findNote.title = title.trim();
    }

    if (content !== undefined) {
        if (typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({
                message: "Content must be a non-empty string"
            });
        }
        findNote.content = content.trim();
    }

    if (isFavorite !== undefined) {
        if (typeof isFavorite !== "boolean") {
            return res.status(400).json({
                message: "isFavorite must be a boolean"
            });
        }
        findNote.isFavorite = isFavorite;
    }

    findNote.updatedAt = new Date();

    return res.status(200).json(findNote);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
