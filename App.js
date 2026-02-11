import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    name: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "9876543210",
    location: "Hyderabad",
    targetRole: "Full Stack Developer Intern"
  });

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResume(null);

    try {
      const response = await fetch("http://localhost:5000/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          targetRole: form.targetRole,
          education: [],
          skills: [],
          experience: [],
          projects: []
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to generate resume");
      }
      setResume(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Resume &amp; Portfolio Builder</h1>

      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          marginTop: "20px"
        }}
      >
        {/* Left: Form */}
        <div style={{ width: "40%" }}>
          <h2>Student Details</h2>

          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </label>

          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </label>

          <label>
            Target Role:
            <input
              type="text"
              name="targetRole"
              value={form.targetRole}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </label>

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Resume"}
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>
          )}
        </div>

        {/* Right: Resume Preview */}
        <div
          style={{
            width: "60%",
            border: "1px solid #ccc",
            padding: "20px",
            minHeight: "300px",
            backgroundColor: "#fafafa"
          }}
        >
          <h2>Resume Preview</h2>
          {!resume && <p>Click "Generate Resume" to see the result here.</p>}

          {resume && (
            <div>
              {/* Header */}
              <h2 style={{ marginBottom: "0" }}>{form.name}</h2>
              <p style={{ marginTop: "4px" }}>
                {form.email} | {form.phone} | {form.location}
              </p>

              {/* Summary */}
              <h3>Summary</h3>
              <p>{resume.summary}</p>

              {/* Skills */}
              {resume.skills && resume.skills.length > 0 && (
                <>
                  <h3>Skills</h3>
                  <ul>
                    {resume.skills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Projects */}
              {resume.projects && resume.projects.length > 0 && (
                <>
                  <h3>Projects</h3>
                  {resume.projects.map((project, idx) => (
                    <div key={idx} style={{ marginBottom: "10px" }}>
                      <strong>{project.name}</strong>
                      {project.techStack && (
                        <p>Tech: {project.techStack.join(", ")}</p>
                      )}
                      {project.bullets && (
                        <ul>
                          {project.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Education */}
              {resume.education && resume.education.length > 0 && (
                <>
                  <h3>Education</h3>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} style={{ marginBottom: "10px" }}>
                      <strong>{edu.degree}</strong>
                      <p>
                        {edu.institute} ({edu.year})
                      </p>
                      {edu.details && (
                        <ul>
                          {edu.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

