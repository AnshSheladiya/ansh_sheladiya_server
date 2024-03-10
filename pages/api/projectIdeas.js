// pages/api/projectIdeas.js
import { dbConnect } from "@/utils/dbConnect";
import ProjectIdea from '../../models/ProjectIdea';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { appName, topic, priority } = req.body;
      const projectIdea = new ProjectIdea({ appName, topic, priority });
      await projectIdea.save();
      res.status(201).json({ success: true, data: projectIdea });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const projectIdeas = await ProjectIdea.find();
      res.status(200).json({ success: true, data: projectIdeas });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }else if (req.method === "PATCH") {
    try {
      const { id } = req.query;
      const { priority } = req.body;
      const updatedIdea = await ProjectIdea.findByIdAndUpdate(
        id,
        { priority },
        { new: true }
      );
      res.status(200).json({ success: true, data: updatedIdea });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }  else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
