const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Post = require("./models/Post");
const cloudinary = require('cloudinary').v2;
     /// cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  }
});
const upload = multer({
    storage}).single('image');
  

    router.post('/posts/:id/image', upload, async (req, res) => {
        if (req.file === undefined) {
          return res.status(400).json({ err: 'Please select an image' });
        }
      
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Posts"
          });
      
          const post = await Post.findById(req.params.id);
          
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
      
          post.image = result.secure_url;
          post.public_id = result.public_id;
          await post.save();
      
          await fs.unlink(req.file.path);
      
          return res.status(200).json({
            message: 'Image uploaded successfully',
            id: post._id,
            image: post.image
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
      });

 // to insert a new post
 router.post("/posts", async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author : req.body.author,
        date : req.body.date,
    
    })
    await post.save()
    res.send(post)
})