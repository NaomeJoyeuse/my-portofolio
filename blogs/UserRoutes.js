const express = require("express");
const Post = require("./models/User");

router.post("/user", async (req, res) => {
    const users = new Post({
        username: req.body.title,
        email: req.body.content,
       
    })
    await users.save()
    res.send(users)
})