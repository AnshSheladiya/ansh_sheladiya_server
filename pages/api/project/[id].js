// pages/api/projectIdeas.js
import ProjectIdea from "@/models/ProjectIdea";
import { dbConnect } from "@/utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

 if (req.method === "PATCH") {
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
  }  else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await ProjectIdea.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Project idea removed" });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
