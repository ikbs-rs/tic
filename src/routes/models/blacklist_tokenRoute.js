import express from "express";

import blacklist_tokenController from "../../controllers/blacklist_tokenController.js"
import { verifyJWT } from '../../middleware/token.js'

const router = express.Router();

router.post("/", verifyJWT, blacklist_tokenController.create);
router.get("/", blacklist_tokenController.findAll);
router.delete("/:id", verifyJWT, blacklist_tokenController.deleteOne);

export default router;

/*

const express = require('express');
const router = express.Router();
const blacklist_tokens = require('../../models/Blacklist_token');
const authenticateJWT = require('../../middleware/authenticateJWT')

// GET all blacklisted tokens
router.get('/', authenticateJWT, (req, res) => {
    blacklist_tokens.findAll()
        .then(tokens => res.json(tokens))
        .catch(err => res.status(500).json({ message: 'Error retrieving blacklisted tokens', error: err }));
});

// POST new blacklisted token
router.post('/', authenticateJWT, (req, res) => {
    blacklist_tokens.create(req.body)
        .then(token => res.json({ message: 'Token blacklisted', token: token }))
        .catch(err => res.status(500).json({ message: 'Error blacklisting token', error: err }));
});

// DELETE blacklisted token by id
router.delete('/:id', authenticateJWT, (req, res) => {
    blacklist_tokens.delete(req.params.id)
        .then(() => res.json({ message: 'Token removed from blacklist' }))
        .catch(err => res.status(500).json({ message: 'Error removing token from blacklist', error: err }));
});

module.exports = router;
*/