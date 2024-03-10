// models/GujaratBoardExamPapers.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const GujaratBoardExamPapersSchema = new Schema({
  standard: {
    type: String,
    required: true,
  },
  details: [
    {
      text: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
  ],
});

const GujaratBoardExamPapers =mongoose.models.GujaratBoardExamPapers ||  mongoose.model('GujaratBoardExamPapers', GujaratBoardExamPapersSchema);

export default GujaratBoardExamPapers;
