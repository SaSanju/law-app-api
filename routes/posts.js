const router = require("express").Router();
const User = require("./../models/User");
const Post = require("./../models/Post");

// Create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Like / dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get timeline posts
router.get("/timeline/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userPost = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPost.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
