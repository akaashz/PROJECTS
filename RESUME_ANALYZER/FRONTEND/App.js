import { useState } from "react";
import axios from "axios";
import { FaFileUpload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !jobDesc) {
      alert("Upload resume & enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDesc);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/analyze/",
        formData
      );
      setResult(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
      alert("Backend error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center p-6">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-2xl text-white transition-all duration-500">

        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          🚀 AI Resume Analyzer
        </h1>

        {/* Upload */}
        <label className="flex items-center gap-2 bg-white/20 p-3 rounded cursor-pointer hover:bg-white/30 transition">
          <FaFileUpload />
          <span>{file ? file.name : "Upload Resume"}</span>
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Job Description */}
        <textarea
          placeholder="Paste Job Description..."
          className="w-full mt-4 p-3 rounded bg-white/20 placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
          rows="5"
          onChange={(e) => setJobDesc(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-800 p-3 rounded font-semibold transition transform hover:scale-105"
        >
          Analyze Resume
        </button>

        {/* Loading */}
        {loading && (
          <div className="mt-4 text-center animate-pulse">
            ⏳ Analyzing Resume...
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 animate-fadeIn">

            <h2 className="text-xl font-semibold mb-3 text-center">
              📊 Analysis Result
            </h2>

            {/* Score Circle */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-green-400"
                  style={{
                    clipPath: `inset(${100 - result["Resume Score (%)"]}% 0 0 0)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                  {result["Resume Score (%)"]}%
                </div>
              </div>
            </div>

            <p className="text-center mb-3">
              Fit Level: {result["Fit Level"]}
            </p>

            {/* Skills */}
            <div className="mt-3 bg-green-500/20 p-3 rounded flex gap-2">
              <FaCheckCircle className="mt-1 text-green-400" />
              <div>
                <h4 className="font-semibold">Skills Found</h4>
                <p>{result["Skills Found"].join(", ")}</p>
              </div>
            </div>

            {/* Missing */}
            <div className="mt-3 bg-red-500/20 p-3 rounded flex gap-2">
              <FaTimesCircle className="mt-1 text-red-400" />
              <div>
                <h4 className="font-semibold">Missing Skills</h4>
                <p>{result["Missing Skills"].join(", ")}</p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-3 bg-blue-500/20 p-3 rounded">
              <h4 className="font-semibold">💡 Suggestions</h4>
              <ul className="list-disc pl-5">
                {result["Suggestions"].map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;