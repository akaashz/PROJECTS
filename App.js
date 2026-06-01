from PyPDF2 import PdfReader
import re
from skills import SKILLS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('wordnet')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Extract PDF text
def extract_text_from_pdf(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

# Clean text
def clean_text(text):
    words = text.lower().split()
    filtered = [
        lemmatizer.lemmatize(word)
        for word in words
        if word not in stop_words
    ]
    return " ".join(filtered)

# Extract skills
def extract_skills(text):
    found_skills = []
    for skill in SKILLS:
        if skill in text:
            found_skills.append(skill)
    return list(set(found_skills))

# Similarity
def calculate_similarity(resume, job_desc):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume, job_desc])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])
    return float(similarity[0][0])

# Final score
def final_score(similarity, resume_skills, job_desc):
    job_skills = extract_skills(job_desc)

    if len(job_skills) == 0:
        skill_score = 0
    else:
        skill_score = len(set(resume_skills) & set(job_skills)) / len(job_skills)

    final = (0.6 * similarity) + (0.4 * skill_score)
    return final

# Category
def get_score_category(score):
    percentage = score * 100

    if percentage > 70:
        return percentage, "High"
    elif percentage > 40:
        return percentage, "Medium"
    else:
        return percentage, "Low"

# Missing skills
def missing_skills(resume_skills, job_desc):
    job_skills = extract_skills(job_desc)
    return list(set(job_skills) - set(resume_skills))
