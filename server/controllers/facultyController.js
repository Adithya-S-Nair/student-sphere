require("dotenv").config();
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginFaculty = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(404).json({ msg: "User Not Found" });
        }
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Wrong password" });
        }
        const date = new Date()
        await User.updateOne({ email }, { $set: { lastLoggedInAt: date } });
        jwt.sign({ userId: userData._id, username: userData.username, role: userData.role }, process.env.JWT_SECRET, (err, token) => {
            if (err)
                throw err
            res.cookie('token', token).status(201).json({ id: userData._id, username: userData.username });
        })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const registerFaculty = async (req, res) => {
    if (req.role === 'superfaculty') {
        const { username, email, password } = req.body
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'faculty'
        });
        newUser.save()
            .then((response) => {
                res.status(201).json({ id: response._id, username })
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Error creating user' });
            });
    } else {
        res.status(401).json({ msg: 'Not a super faculty' })
    }
}

module.exports = {
    registerFaculty,
    loginFaculty
};