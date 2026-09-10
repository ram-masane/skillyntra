from fastapi import APIRouter
from pydantic import BaseModel

from app.services.assessment_service import ensure_demo_assessment, get_assessment, grade_assessment

router = APIRouter(prefix="/api/assessments", tags=["assessments"])

class AnswerSheet(BaseModel):
    answers: dict[int, str]


@router.get("/demo")
def get_demo_assessment() -> dict:
    assessment_id = ensure_demo_assessment()
    assessment = get_assessment(assessment_id)
    return {"id": assessment_id, "title": assessment["title"], "duration_minutes": 5, "passing_score": assessment["passing_score"], "questions": assessment["questions"]}


@router.post("/demo/grade")
def grade_demo(sheet: AnswerSheet) -> dict:
    return grade_assessment(ensure_demo_assessment(), "demo-student", sheet.answers)
