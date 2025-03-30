import express from "express";
import File from "../modules/File.js"; // Import the File model

const router = express.Router();

// Update file content when changes are made
router.put("/file/update/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const { content } = req.body;

  try {
    const updatedFile = await File.findByIdAndUpdate(fileId, { content }, { new: true });

    if (!updatedFile) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.json({ success: true, updatedFile });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
