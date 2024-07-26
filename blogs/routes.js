const express = require("express");
const Post = require("./models/Post");
const User = require("./models/User");
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");
const BlogsInteraction = require("./models/BlogsInteraction");
const router = express.Router();
const fs = require('fs').promises;

router.post("/user", async (req, res) => {
    const user = new User({
        username: req.body.username,
        useremail: req.body.useremail,
       
    })
    await user.save()
    res.send(user)
})
router.get("/blogs", async (req, res) => {
    const posts = await Post.find ();
    res.send(posts)   

});

// router.post("/blogs", async (req, res) => {
//     const post = new Post({
//         title: req.body.title,
//         content: req.body.content,
//         author : req.body.author,
//         date : req.body.date,
    
//     })
//     await post.save()
//     res.send(post)
// })
router.post('/blogs', upload, async (req, res) => {
    try {
        const { title, content, author } = req.body;


        if (!req.file) {
            return res.status(400).json({ err: 'Please select an image' });
        }

        
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Blogs"
        });

    
        const post = new Post({
            title,
            content,
            author,
            image: result.secure_url,
            public_id: result.public_id
        });

        
        await post.save();

     
        await fs.unlink(req.file.path);

      
        return res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.get("/blogs/:id", async (req, res) => {
    try{
    const post = await Post.findOne({_id: req.params.id});
    res.send(post)
    }catch{
        res.status(404).send("Post not found")
    }
})
router.patch("/blogs/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })

        if (req.body.title) {
            post.title = req.body.title
        }

        if (req.body.content) {
            post.content = req.body.content
        }
        if (req.body.content) {
            post.author = req.body.content
        }

        await post.save()
        res.send(post)
    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!" })
    }
})
router.delete("/blogs/:id", async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Post doesn't exist!" })
    }
})



router.post('/blogs/:id/image', upload, async (req, res) => {
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


  ///inserting comment
  router.post('/blogs/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.body.user, 
            type: 'comment',
            content: req.body.content
        };

        post.interactions.push(comment);
        await post.save();

        return res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

//retrieving all comments on the BlogsInteraction

router.get('/blogs/:id/Allcomments', async (req, res) => {
    try {
      const { id } = req.params;
  
     
      const post = await Post.findById(id).populate('interactions.user', 'username'); 
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const comments = post.interactions.filter(interaction => interaction.type === 'comment');
  
      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  //to like a post 
  router.post('/blogs/:id/likes', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // const userId = req.body.user;
        // if (!userId) {
        //     return res.status(400).json({ message: 'User ID is required' });
        // }

        const existingLikeIndex = post.interactions.findIndex(
            interaction => interaction.type === 'like'
        );

        if (existingLikeIndex > -1) {
        
            post.interactions.splice(existingLikeIndex, 1);
        } else {
    
            post.interactions.push({
                user: req.body.user,
                type: 'like'
            });
        }

        await post.save();

        return res.status(200).json({ message: 'Like status updated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router



