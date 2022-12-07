const mongoose = require('mongoose');

const CodeBlockSchema = new mongoose.Schema({
  mentorId: {
    type: String,
    required: [true, 'Provide a mentor id'],
  },

  studentId: {
    type: String,
    required: [true, 'Provide a student id'],
  },

  codeBlockId: {
    type: String,
    required: [true, 'Provide a code block id'],
  },

  codeText: {
    type: String,
  },
});

const CodeBlockModel = mongoose.model('CodeBlocks', CodeBlockSchema);

CodeBlockSchema.createIndexes();
module.exports = mongoose.model.CoeBlocks || CodeBlockModel;
