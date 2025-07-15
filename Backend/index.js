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
const Contest = require("./MODEL/contest");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // required to use jwt for token generation
const dotenv = require("dotenv");
const { aiCodeReview } = require('./aiCodeReview');
const { aiErrorAnalysis } = require('./aiErrorAnalysis');
const { aiReviewApproach} = require('./aiReviewApproach');
const createContest = require("./createContest"); 
dotenv.config()
const cors = require("cors"); 
//Cross origin resource sharing 
app.use(cors({
  origin: "http://localhost:5173", // Your frontend's URL
  credentials: true, // If using cookies or auth headers
}));


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
        if (!req.body) {
            return res.status(400).send("Request body is missing");
        }

        const { firstname, lastname, email, password, userId } = req.body;
        if (!(firstname && lastname && email && password && userId)) {
            return res.status(400).send("Please enter all the information");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists with the same email");
        }

        const existingUser2 = await User.findOne({ userId });
        if (existingUser2) {
            return res.status(400).send("User already exists with the same id");
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            userId: userId.trim()
        });

        const userResponse = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email ,
            userId:user.userId
        };

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "7d", // Token valid for 7 days
            }
        );

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // use HTTPS in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict"
        });

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

app.post("/signup", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send("Request body is missing");
        }

        const { email, userId, password } = req.body;

        if (!(password && (email || userId))) {
            return res.status(400).send("Please enter email or userId and password");
        }

        let user;

        if (email) {
            user = await User.findOne({ email: email.toLowerCase().trim() });
        } else if (userId) {
            user = await User.findOne({ userId: userId.trim() });
        }

        if (!user) {
            return res.status(400).send("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send("Invalid credentials");
        }

        const userResponse = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            userId:user.userId 
        };

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Login successful!",
            user: userResponse,
            token: token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server error");
    }
});




////////////////////////////////////////CRUD OPERATIONS ON PROBLEMS DATABASE////////////////////////////////////////////////

/////////////////////////////////////////CREATE////////////////////////////////////////////////////////////////////
const problem = require("./MODEL/problem.js");
app.post("/admin/create", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send("Problem Request body is missing");
        }

        const {
            ProblemID,
            Title,
            topics,
            difficulty,
            Description,
            VisibletestCase,
            HiddentestCase,
            inputFormat,
            outputFormat,
            InvisibleTime, // ✅ Accepting InvisibleTime optionally
            Solution

        } = req.body;

        if (!(ProblemID && Title && topics && difficulty && Description && VisibletestCase && HiddentestCase && inputFormat && outputFormat)) {
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
                existingProblemId: existingProblem.ProblemId,
            });
        }

        const Problem = await problem.create({
            ProblemID: ProblemID,
            Title: Title.trim(),
            topics: topics,
            difficulty: difficulty,
            Description: Description.trim(),
            VisibletestCase: VisibletestCase,
            HiddentestCase: HiddentestCase,
            inputFormat: inputFormat.trim(),
            outputFormat: outputFormat.trim(),
            InvisibleTime: InvisibleTime || null, // ✅ Set to null if not provided
            Solution:Solution 
        });

        const problemResponse = {
            id: Problem._id,
            
            Title: Problem.Title,
        };

        res.status(200).json({
            success: true,
            message: "Problem created Successfully",
            response: problemResponse,
        });

    } catch (error) {
        console.error("Problem not created", error);
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
            HiddentestCase,
            inputFormat,          // ✅ Added inputFormat
            outputFormat          // ✅ Added outputFormat
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
        existingProblem.inputFormat = inputFormat?.trim() || existingProblem.inputFormat;      // ✅ Added this line
        existingProblem.outputFormat = outputFormat?.trim() || existingProblem.outputFormat;    // ✅ Added this line

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


app.post("/review-approach", async (req, res) => {
    const { approach, ProblemID } = req.body;

    if (!approach || ProblemID === undefined) {
        return res.status(400).json({ success: false, error: "Missing approach text or ProblemID!" });
    }

    try {
        const review = await aiReviewApproach(approach, ProblemID);
        res.json({ review });
    } catch (error) {
        res.status(500).json({ error: "Error in reviewing approach: " + error.message });
    }
});




app.post("/create-contest", async (req, res) => {
  const result = await createContest(req.body);
  res.status(result.success ? 201 : 400).json(result);
});


//THIS WILL RETURN THE PROBLEM LIST TO THE TABLE 
app.get("/api/problems", async (req, res) => {

//     .find({}) tells Mongoose:
// → "Give me all documents in the problems collection."

// The second argument { Title: 1, ProblemID: 1, difficulty: 1, _id: 0 } is a projection:
// → It tells MongoDB: "Only send me these specific fields. Don’t send _id."
    try {
        const allProblems = await problem.find({}, {
            Title: 1,
            ProblemID: 1,
            difficulty: 1,
            InvisibleTime: 1,  // ✅ Only used internally, not sent in response
            _id: 0
        });

        const now = new Date();

        const visibleProblems = allProblems.filter(item => {
            if (!item.InvisibleTime || !item.InvisibleTime.end) return true;  // No invisible time → always show
            const end = new Date(item.InvisibleTime.end);
            return now > end;  // ✅ Show only if current time is after invisible end time
        });

        // ✅ Map only required fields for the response
        const problems = visibleProblems.map(({ Title, ProblemID, difficulty }) => ({
            Title,
            ProblemID,
            difficulty
        }));

        res.status(200).json({
            success: true,
            problems
        });

    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


//This will fetch the complete problems 
app.get("/api/problem/:problemID", async (req, res) => {
    try {
        const problemID = parseInt(req.params.problemID);

        const foundProblem = await problem.findOne(
            { ProblemID: problemID },
            {
                Title: 1,
                ProblemID: 1,
                difficulty: 1,
                Description: 1,
                VisibletestCase: 1,
                HiddentestCase: 1,
                inputFormat: 1,
                outputFormat: 1,
                topics: 1,
                _id: 1,
                __v: 1,
            }
        );

        if (!foundProblem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        res.status(200).json({
            success: true,
            problem: foundProblem
        });

    } catch (error) {
        console.error("Error fetching problem:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});



app.get("/api/contests", async (req, res) => {
  try {
    const contests = await Contest.find({}, {
      contestName: 1,
      contestId: 1,
      startTime: 1,
      endTime: 1,
      problems: 1,
      _id: 0,
    });
    res.status(200).json({ success: true, contests });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/contest/:contestId", async (req, res) => {
    try {
        const contest = await Contest.findOne({ contestId: req.params.contestId });
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        const problemDetails = await Promise.all(
            contest.problems.map(async (p) => {
                // ✅ Use problem model (lowercase p)
                const prob = await problem.findOne({ ProblemID: p.problemID });

                return {
                    Title: prob?.Title || "Unknown",
                    ProblemID: p.problemID,
                    points: p.points,
                    difficulty: prob?.difficulty || "Unknown",
                };
            })
        );

        res.status(200).json({
            success: true,
            contest,
            problemDetails
        });

    } catch (error) {
        console.error("Error fetching contest:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});
