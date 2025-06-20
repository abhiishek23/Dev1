// we will create the express server 

// REGISTRATION 

// req means request 
// res means response 
// the express server will take the request from frontend and will send the response
// "/" represents the route , what actions to be taken 
// get and post are the two types of HTTP requests 
// when user wants to send some data to the server we will use post else use get  

const express = require("express");
console.log("File is running...");
const app = express();
const { DBconnection } = require("./Database/db");
const User = require("./MODEL/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // required to use jwt for token generation
const dotenv = require("dotenv");
dotenv.config()

// ✅ Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBconnection();

app.get("/", (req, res) => {
    res.send("server working fine ");
});

// ✅ Wrap the route logic in try-catch INSIDE the route handler
app.post("/register", async (req, res) => {
    try {
        // get all the data from the frontend  
        if (!req.body) {
    return res.status(400).send("Request body is missing");
}

const { firstname, lastname, email, password } = req.body;
        // check that all the data should exist
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists with the same email");
        }

        // hashing the password 
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // register the user into the database 
        const user = await User.create({
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        // READ ABOUT JWT - JSON WEB TOKENS

        // preparing a response object without password
        const userResponse = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        };

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "24h",
            }
        );

        res.status(200).json({
            success: true,
            message: "Registration successful!",
            user: userResponse,
            token: token
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server error");
    }
});

app.listen(4000, () => {
    console.log("server is listening on port 4000");
});
