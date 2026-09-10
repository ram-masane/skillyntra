from pathlib import Path

import pandas as pd
from fastapi import APIRouter

from app.routes.jobs import service
from app.services.job_service import split_skills

router = APIRouter(prefix="/api/institute", tags=["institute"])
COURSES = pd.read_csv(Path(__file__).resolve().parents[4] / "data" / "courses.csv")


@router.get("/programs")
def programs() -> list[str]:
    return sorted(COURSES.course.tolist())


@router.get("/programs/{course}")
def alignment(course: str) -> dict:
    row = COURSES[COURSES.course.eq(course)]
    if row.empty:
        return {"course": course, "taught": [], "required": [], "missing": [], "alignment": 0, "status": "At Risk"}
    taught = split_skills(row.iloc[0].skills)
    required = service.skill_demand().head(15).skill.tolist()
    taught_norm = {skill.lower() for skill in taught}
    covered = [skill for skill in required if skill.lower() in taught_norm]
    missing = [skill for skill in required if skill.lower() not in taught_norm]
    score = round(len(covered) / max(1, len(required)) * 100)
    return {"course": course, "taught": taught, "required": required, "missing": missing, "alignment": score, "status": "Healthy" if score >= 70 else "Needs Update" if score >= 40 else "At Risk"}
