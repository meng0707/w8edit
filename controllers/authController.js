const bcrypt = require("bcryptjs");
const UserActivation = require("../models/users"); // ตรวจสอบการใช้งานโมเดล

//register
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = new UserActivation({ username, password: hashedPassword});
       await user.save();
       res.status(201).send("User registered");
    }  catch (err) {
        res.status(400).send(err.message);
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("User not found");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid");

        const accessToken = jwt.sign(
            {userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ accessToken, refreshToken} );
    }catch (err) {
        res.status(500).send(err.message);
    }
};
