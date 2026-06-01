from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware  
from utils import *

app = FastAPI()

# 👇 ADD THIS BLOCK RIGHT HERE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze/")
@app.post("/analyze/")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Extract
    resume_text = extract_text_from_pdf(file.file)

    # Clean
    resume_clean = clean_text(resume_text)
    job_clean = clean_text(job_description)

    # Skills
    resume_skills = extract_skills(resume_clean)

    # Similarity
    sim = calculate_similarity(resume_clean, job_clean)

    # Score
    score = final_score(sim, resume_skills, job_clean)
    percentage, category = get_score_category(score)

    # Missing skills
    missing = missing_skills(resume_skills, job_clean)

    return {
        "Resume Score (%)": round(percentage, 2),
        "Fit Level": f"{category} ✅" if category == "High" else f"{category} ⚠️",
        "Skills Found": resume_skills,
        "Missing Skills": missing,
        "Suggestions": [f"Learn {skill}" for skill in missing]
    }
