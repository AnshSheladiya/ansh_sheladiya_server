
// models/ProjectIdea.js
import mongoose from 'mongoose';

const ProjectIdeaSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    // required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    // required: true
  }
});

const ProjectIdea =mongoose.models.ProjectIdea || mongoose.model('ProjectIdea', ProjectIdeaSchema);

export default ProjectIdea;
