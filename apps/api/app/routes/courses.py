from fastapi import APIRouter
from pydantic import BaseModel

from app.services.course_service import list_courses as stored_courses

router = APIRouter(prefix="/api/courses", tags=["courses"])
class Course(BaseModel):
    course: str
    partner: str
    skills: list[str]
    placement_rate: float
    employer_validation: float


@router.get("", response_model=list[Course])
def list_courses() -> list[Course]:
    return [Course(**course) for course in stored_courses()]
