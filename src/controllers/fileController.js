import multer from 'multer';
import path from 'path';
import fileUtils from '../middleware/fuleUtils.js'; // Dodajte import
import { cwd } from 'node:process';

const storage = multer.memoryStorage(); // Koristimo memoryStorage za upload

const upload = multer({ storage });

const uploadFile = (req, res) => {
    console.log("Dosao u Kontroler");
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }

    try {
        console.log(cwd, "Dosao da pokusam", path.join(process.cwd(), '/public/tic/images'));
      const filePath = await fileUtils.uploadFile(req.file, path.join(process.cwd(), '/public/tic/images'));
      return res.json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
      return res.status(500).json({ error: 'Error uploading file' });
    }
  });
};

const deleteFile = async (req, res) => {
    const fileName = req.params.fileName;
  
    try {
      const filePath = path.join(__dirname, '../../../public/tic/images', fileName);
      await fileUtils.deleteFile(filePath);
      return res.json({ message: 'File deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting file' });
    }
  };

export default {
    uploadFile,
    deleteFile
}
