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
const { aiCodeReview } = require('./aiCodeReview');
const { aiErrorAnalysis } = require('./aiErrorAnalysis');
const createContest = require("./createContest"); 
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

        const { firstname, lastname, email, password ,userId } = req.body;
        // check that all the data should exist
        if (!(firstname && lastname && email && password && userId)) {
            return res.status(400).send("Please enter all the information");
        }

        // check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists with the same email");
        }

         const existingUser2 = await User.findOne({ userId });
        if (existingUser2) {
            return res.status(400).send("User already exists with the same id");
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
            userId: userId.trim()

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




////////////////////////////////////////CRUD OPERATIONS ON PROBLEMS DATABASE////////////////////////////////////////////////

/////////////////////////////////////////CREATE////////////////////////////////////////////////////////////////////
const problem = require("./MODEL/problem.js");
app.post("/admin/create", async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).send("Problem Request body is missing");
        }
        //   ?req means request — it holds all the data sent by the client.
        // req.body is used to get the data sent by the client in the body of the request.

        const { ProblemID, Title, topics, difficulty, Description, VisibletestCase, HiddentestCase } = req.body;
        //THE ABOVE STEP IS CALLED DESTRUCTURING  
        if (!(ProblemID && Title && topics && difficulty && Description && VisibletestCase && HiddentestCase)) {
            return res.status(400).send("Please enter all the information");
        }


        const existingid = await problem.findOne({ ProblemID });
        if (existingid) {
            return res.status(400).send("problem already exists with the same id");
        }

        const existingProblem = await problem.findOne({ Title });
        if (existingProblem) {
            return res.status(400).json({
                message: "Problem already exists with the same title",
                existingProblemId: existingProblem.ProblemId
            });
        }



        // create the problem into the database 
        const Problem = await problem.create({
            ProblemID: ProblemID,
            Title: Title.trim(),
            topics: topics, // should be an array of strings
            difficulty: difficulty,
            Description: Description.trim(),
            VisibletestCase: VisibletestCase, // array of objects
            HiddentestCase: HiddentestCase    // array of objects
        });


        // READ ABOUT JWT - JSON WEB TOKENS

        // preparing a response object without password
        const problemResponse = {
            id: Problem._id,
            SecondaryID: Problem.ProblemId,
            Title: Problem.Title,

        };


        res.status(200).json({
            success: true,
            message: "Problem created Successfully ",
            response: problemResponse,

        });
    } catch (error) {
        console.error("Problem not created ", error);
        res.status(500).send("Server error");
    }
});

////////////////////////////////////READING OR ACCESSING THE QUESTIONS ////////////////////////
//get question by id 


app.post("/findID", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send("Problem request body is missing");
        }

        const { ProblemID } = req.body;

        if (!ProblemID) {
            return res.status(400).send("Please enter Problem ID");
        }

        const existingProblem = await problem.findOne({ ProblemID });

        if (!existingProblem) {
            return res.status(404).send("Problem does not exist with the given ID");
        }

        // Return full problem data to the frontend
        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem: existingProblem
        });

    } catch (error) {
        console.error("Problem not found", error);
        res.status(500).send("Server error");
    }
});

////UPDATE /////////////////////////////////////////////////////////////////////////////////////////////
// STEP 2 - Save updated problem
app.post("/update/save", async (req, res) => {
    try {
        const {
            ProblemID,
            Title,
            topics,
            difficulty,
            Description,
            VisibletestCase,
            HiddentestCase
        } = req.body;

        if (!ProblemID) {
            return res.status(400).send("Problem ID is required");
        }

        const existingProblem = await problem.findOne({ ProblemID });

        if (!existingProblem) {
            return res.status(404).send("Problem does not exist");
        }

        // Update fields
        existingProblem.Title = Title?.trim() || existingProblem.Title;
        existingProblem.topics = topics || existingProblem.topics;
        existingProblem.difficulty = difficulty || existingProblem.difficulty;
        existingProblem.Description = Description?.trim() || existingProblem.Description;
        existingProblem.VisibletestCase = VisibletestCase || existingProblem.VisibletestCase;
        existingProblem.HiddentestCase = HiddentestCase || existingProblem.HiddentestCase;

        // Save updated document
        const updatedProblem = await existingProblem.save();

        res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            updatedProblem
        });

    } catch (error) {
        console.error("Update failed", error);
        res.status(500).send("Server error");
    }
});



/////////////////////////////////////////////////////////////////////////////////DELETE /////////////////////////
app.post("/delete", async (req, res) => {
    try {
        const {
            ProblemID,
        } = req.body;

        if (!ProblemID) {
            return res.status(400).send("Problem ID is required");
        }

        const existingProblem = await problem.findOne({ ProblemID });

        if (!existingProblem) {
            return res.status(404).send("Problem does not exist");
        }

       
     await existingProblem.deleteOne();

        res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
            
        });

    } catch (error) {
        console.error("Delete failed", error);
        res.status(500).send("Server error");
    }
});

app.post("/delete-multiple", async (req, res) => {
    try {
        const { problemIDs, confirm } = req.body;

        if (!Array.isArray(problemIDs) || problemIDs.length === 0) {
            return res.status(400).send("An array of ProblemIDs is required");
        }

        // Step 1: Preview mode (admin has not confirmed yet)
        if (!confirm) {
            const problemsToDelete = await problem.find({ ProblemID: { $in: problemIDs } });

            if (problemsToDelete.length === 0) {
                return res.status(404).send("No matching problems found to preview");
            }

            // Send preview to frontend
            return res.status(200).json({
                success: false,
                message: "Please confirm deletion of the following problems",
                problems: problemsToDelete.map(p => ({
                    ProblemID: p.ProblemID,
                    Title: p.Title
                }))
            });
        }

        // Step 2: Deletion (admin has confirmed)
        const deleteResult = await problem.deleteMany({ ProblemID: { $in: problemIDs } });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).send("No matching problems found to delete");
        }

        res.status(200).json({
            success: true,
            message: `${deleteResult.deletedCount} problem(s) deleted successfully`,
        });

    } catch (error) {
        console.error("Batch delete failed", error);
        res.status(500).send("Server error");
    }
});

app.post("/ai", async (req, res) => {
    const { code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const review = await aiCodeReview(code);
        res.json({ "review": review });
    } catch (error) {
        res.status(500).json({ error: "Error in AI review, error: " + error.message });
    }
});



app.post("/errorAnalysis", async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, error: "User ID is required" });
    }

    try {
       
        const user = await User.findOne({ userId }); 

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const history = user.errorHistory;

        if (!history || history.length === 0) {
            return res.status(404).json({ success: false, error: "No error history found" });
        }

        
        const review = await aiErrorAnalysis(history);

       
        res.json({ success: true, review });

    } catch (error) {
        console.error("Error analyzing error history:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});



app.post("/create-contest", async (req, res) => {
  const result = await createContest(req.body);
  res.status(result.success ? 201 : 400).json(result);
});




