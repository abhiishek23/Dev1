import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import Split from "react-split";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import WritePop from "./WritePop";
import Popup from "./popup";

const boilerplates = {
  "C++": `#include <bits/stdc++.h>
using namespace std;
int main() {
    return 0;
}`,
  C: `#include <stdio.h>
int main() {
    return 0;
}`,
  Python: `def main():
    pass
if __name__ == "__main__":
    main()`,
  Java: `public class Main {
    public static void main(String[] args) {
    }
}`,
  JavaScript: `function main() {
    console.log("Hello, world!");
}
main();`,
  Golang: `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`,
};

const languageExtensions = {
  "C++": cpp(),
  C: cpp(),
  Python: python(),
  Java: java(),
  JavaScript: javascript(),
  Golang: go(),
};

const languageMap = {
  "C++": "cpp",
  C: "c",
  Python: "python",
  Java: "java",
  JavaScript: "javascript",
  Golang: "golang",
};

const CodingPage = () => {
  const { id: problemID } = useParams();
  const loggedInUser = useSelector((state) => state.user.user);
  const signedUpUser = useSelector((state) => state.signup.user);
  const user = loggedInUser || signedUpUser;
  const userId = user?.userId;

  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState(boilerplates["C++"]);
  const [problemData, setProblemData] = useState(null);

  const [showWritePop, setShowWritePop] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [popupContent, setPopupContent] = useState("");
  const [activeTab, setActiveTab] = useState("Editor");
  const [outputResponse, setOutputResponse] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/problem/${problemID}`);
        if (response.data.success) {
          setProblemData(response.data.problem);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    if (problemID) fetchProblem();
  }, [problemID]);

  const handleAuthCheck = () => {
    if (!userId) {
      setPopupContent("User not logged in or signed up.");
      setShowPopup(true);
      return false;
    }
    return true;
  };

const handleSubmit = async () => {
  if (!handleAuthCheck()) return;

  try {
    setLoadingAction("submit");

    const res = await axios.post("http://localhost:7000/submit-contest", {
      language: languageMap[language],
      code,
      input: "",
      userId,
      topics: problemData?.topics || [],
      difficulty: problemData?.difficulty || "",
      ProblemID: problemData?.ProblemID
    });

    const { success, message, verdict, results, error } = res.data;

    if (success) {
      const outputText = `
✅ Verdict: ${verdict}
📬 Message: ${message}
🧾 Results: ${JSON.stringify(results, null, 2)}
      `;
      setOutputResponse(outputText.trim());
    } else {
      setOutputResponse(`❌ Submission Failed: ${error || "Unknown error."}`);
    }

    setActiveTab("Output");
  } catch (err) {
    console.error(err);

    const stderr =
      err.response?.data?.stderr || err.response?.data?.error || err.message || "Unknown error";

    setOutputResponse(`❌ Error: ${stderr}`);
    setActiveTab("Output");
  } finally {
    setLoadingAction("");
  }
};



const handleRun = async () => {
  if (!handleAuthCheck()) return;

  try {
    setLoadingAction("run");

    const res = await axios.post("http://localhost:7000/run", {
      language: languageMap[language],
      code,
      input: "",
      userId,
      topics: problemData?.topics || [],
      difficulty: problemData?.difficulty || "",
    });

    if (res.data.output) {
      setOutputResponse(res.data.output);
    } else {
      setOutputResponse("Run completed with no output.");
    }

    setActiveTab("Output");
  } catch (err) {
    console.error(err);

    const stderr =
      err.response?.data?.stderr || err.response?.data?.error || err.message || "Unknown error";

    setOutputResponse(stderr);
    setActiveTab("Output");
  } finally {
    setLoadingAction("");
  }
};


  const handleAIReview = async () => {
    try {
      setLoadingAction("ai");
      const res = await axios.post("http://localhost:4000/ai", { code });
      setAiResponse(res.data.review || "AI Review Success");
      setActiveTab("AI Review Result");
    } catch (err) {
      console.error(err);
      setAiResponse("AI Review Error");
      setActiveTab("AI Review Result");
    } finally {
      setLoadingAction("");
    }
  };

  return (
    
  <div className="p-6 overflow-y-auto bg-black-800 text-white leading-relaxed space-y-4">

      <Split className="flex flex-1" sizes={[40, 60]} minSize={200} gutterSize={10}>
 <div className="p-6 overflow-y-auto bg-black-800 text-white leading-relaxed space-y-4">

        
          {problemData ? (
            <>
              <h1 className="text-xl font-bold mb-2">{problemData.Title}</h1>
              <p className="text-sm mb-2">ID: {problemData.ProblemID}</p>
              <p className="text-sm mb-2">Difficulty: {problemData.difficulty}</p>
              <p className="mb-4">{problemData.Description}</p>

              <h2 className="font-semibold">Visible Test Cases:</h2>
              {problemData.VisibletestCase.map((test, index) => (
                <div key={index} className="mb-2">
                  <p><strong>Input:</strong> {test.input}</p>
                  <p><strong>Expected Output:</strong> {test.expectedOutput}</p>
                  {test.explanation && <p><strong>Explanation:</strong> {test.explanation}</p>}
                </div>
              ))}

              <h2 className="font-semibold mt-4">Constraints:</h2>
              <p className="mb-2">[Add constraints here manually or from backend]</p>

              <h2 className="font-semibold">Input Format:</h2>
              <p className="mb-2">{problemData.inputFormat}</p>

              <h2 className="font-semibold">Output Format:</h2>
              <p className="mb-2">{problemData.outputFormat}</p>

              <h2 className="font-semibold">Topics:</h2>
              <p className="mb-4">{problemData.topics.join(", ")}</p>

              <button
                onClick={() => setShowWritePop(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Verify Approach
              </button>
            </>
          ) : (
            <p>Loading problem details...</p>
          )}
        </div>

        <div className="p-4 overflow-y-auto bg-gray-900 text-white flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setCode(boilerplates[e.target.value]);
                }}
                className="bg-gray-800 text-white p-2 rounded"
              >
                {Object.keys(boilerplates).map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={handleRun} className="bg-yellow-500 px-3 py-1 rounded text-black">
                {loadingAction === "run" ? "Running..." : "Run"}
              </button>

              <button onClick={handleAIReview} className="bg-purple-600 px-3 py-1 rounded">
                {loadingAction === "ai" ? "Reviewing..." : "AI Review"}
              </button>

              <button onClick={handleSubmit} className="bg-green-600 px-3 py-1 rounded">
                {loadingAction === "submit" ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            {["Editor", "Output", "AI Review Result"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded ${activeTab === tab ? "bg-gray-700" : "bg-gray-800"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto border border-gray-700">
            {activeTab === "Editor" && (
              <CodeMirror
                value={code}
                height="100%"
                theme="dark"
                extensions={[languageExtensions[language]]}
                onChange={(value) => setCode(value)}
              />
            )}

            {activeTab === "Output" && (
              <div className="p-2 whitespace-pre-line">{outputResponse || "No output yet."}</div>
            )}

            {activeTab === "AI Review Result" && (
              <div className="p-2 whitespace-pre-line">{aiResponse || "No review yet."}</div>
            )}
          </div>
        </div>
      </Split>

      {showWritePop && (
       <WritePop
  onSubmitApproach={async (approachText) => {
    if (!approachText || !problemData?.ProblemID) return;

    try {
      setLoadingAction("approach"); // Disable submit button
      const response = await axios.post("http://localhost:4000/review-approach", {
        approach: approachText,
        ProblemID: problemData.ProblemID,
      });

      const aiReview = response.data.review || "No review returned.";
      setAiResponse(aiReview);
      setPopupContent(aiReview);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Unknown error";
      setAiResponse(`Error: ${errorMsg}`);
      setPopupContent(`Error: ${errorMsg}`);
    } finally {
      setShowWritePop(false); // Close WritePop
      setShowPopup(true);     // Open Popup with AI review
      setLoadingAction("");
    }
  }}
  loading={loadingAction === "approach"} // Optional: pass loading state to WritePop
  onClose={() => setShowWritePop(false)}
/>

      )}

      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        content={<div className="whitespace-pre-line">{popupContent || aiResponse}</div>}
      />
    </div>
    
  );
};

export default CodingPage;







