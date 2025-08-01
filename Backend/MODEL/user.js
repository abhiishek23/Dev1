// //this will store the schema of the users 
// const mongoose = require("mongoose");
// console.log("inside model") 
// /**
//  * User Schema Definition
//  * Defines the structure for user documents in MongoDB
//  * Includes validation and constraints for user data
//  */
// const userSchema = new mongoose.Schema({
//     // User's first name - optional field with string type
//     firstname: {
//         type: String,
//         default: null,
//         required: [true, "First name is required"],
//         trim: true, // Remove whitespace from beginning and end
//         minlength: [2, "First name must be at least 2 characters long"],
//         maxlength: [50, "First name cannot exceed 50 characters"]
//     },
    
//     // User's last name - optional field with string type  
//     lastname: {
//         type: String,
//         default: null,
//         required: [true, "Last name is required"],
//         trim: true,
//         minlength: [2, "Last name must be at least 2 characters long"],
//         maxlength: [50, "Last name cannot exceed 50 characters"]
//     },
//     //USER ID SHOULD BE UNIQUE ACROSS ALL USERS 
//         userId: {
//         type: String,
//         default: null,
//         unique: true,
//         required: [true, " required"],
//         trim: true,
//         minlength: [5, "Last name must be at least 2 characters long"],
//         maxlength: [50, "Last name cannot exceed 50 characters"]
//     },
//     // User's email address - must be unique across all users
//     email: {
//         type: String,
//         required: [true, "Email is required"],
//         unique: true,
//         lowercase: true, // Convert to lowercase before saving
//         trim: true,
//         match: [
//             /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//             "Please enter a valid email address"
//         ]
//     },
    
//     // User's hashed password - will be encrypted before storage
//     password: {
//         type: String,
//         required: [true, "Password is required"],
//         minlength: [6, "Password must be at least 6 characters long"]
//     },

// //    errorHistory: [String],
// errorHistory: [
//   {
//     code: String,
//     language: String,
//     error: String,
//     topics: [String],
//     difficulty: String,
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }
// ]



    
//     // Add timestamp fields for tracking when user was created/updated
// }, {
//     timestamps: true , // Automatically adds createdAt and updatedAt fields
//     strict: true
// });


// // Create and export the User model based on the schema
// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");
console.log("inside model");

/**
 * User Schema Definition
 * Defines the structure for user documents in MongoDB
 * Includes validation and constraints for user data
 */
const userSchema = new mongoose.Schema({
    // User's first name - optional field with string type
    firstname: {
        type: String,
        default: null,
        required: [true, "First name is required"],
        trim: true, // Remove whitespace from beginning and end
        minlength: [2, "First name must be at least 2 characters long"],
        maxlength: [50, "First name cannot exceed 50 characters"]
    },
    
    // User's last name - optional field with string type  
    lastname: {
        type: String,
        default: null,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"]
    },

    // USER ID SHOULD BE UNIQUE ACROSS ALL USERS 
    userId: {
        type: String,
        default: null,
        unique: true,
        required: [true, " required"],
        trim: true,
        minlength: [5, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"]
    },

    // User's email address - must be unique across all users
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, // Convert to lowercase before saving
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },

    // User's hashed password - will be encrypted before storage
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },

    // Error History
    errorHistory: [
        {
            code: String,
            language: String,
            error: String,
            topics: [String],
            difficulty: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    // Attempted Contests - array containing all the contestId user has attempted
    AttemptedContests: [
        {
            type: String, // contestId is string in your Contest schema
            trim: true
        }
    ],

    // Attempted Problems - array containing id of attempted problems
    AttemptedProblems: [
  {
    problemID: {
      type: Number, // Referencing ProblemID from problem schema
      required: true
    },
    approach: {
      type: String, // Description of the approach user submitted for this problem
      trim: true
    }
  }
] ,
   friends: { type: [String], default: [] },
  friendRequestsSent: { type: [String], default: [] },
  friendRequestsReceived: { type: [String], default: [] },


    // WasStruck - array containing all question ids in which the user was struck
    WasStruck: [
        {
            type: Number // Again referencing ProblemID from your Problem schema
        }
    ]

}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    strict: true
});

// Create and export the User model based on the schema
module.exports = mongoose.model("User", userSchema);
