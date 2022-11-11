const Note = require("../models/Note");
const { validationResult } = require("express-validator");

exports.createNote = async (req, res) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create new note
    const note = new Note(req.body);

    note.user = req.user.id;
    // we need to assign the user id to the note
    await note.save();
    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(400).send("There was an error creating the note", error);
  }
};

exports.getNotes = async (req, res) => {
  try {
    // Get notes for current user
    const { id } = req.params.id;
    // bring the notes from the database that match the user id
    const notes = await Note.find({ user: id }).sort({ date: -1 });

    res.json({ notes });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error getting the notes");
  }
};
