from __future__ import annotations

import pandas as pd

from .job_service import split_skills, skill_demand


def course_health(course: pd.Series, jobs: pd.DataFrame) -> dict:
    taught = split_skills(course.get("skills", ""))
    demand = skill_demand(jobs)
    demand_map = dict(zip(demand["skill"].str.lower(), demand["job_signals"]))
    covered_signals = sum(demand_map.get(skill.lower(), 0) for skill in taught)
    total_signals = max(1, int(demand["job_signals"].sum()))
    alignment = min(100, round(covered_signals / total_signals * 100 * 4))
    placement = float(course.get("placement_rate", 0))
    employer = float(course.get("employer_validation", 0))
    score = round(0.45 * alignment + 0.30 * placement + 0.25 * employer)
    status = "Healthy" if score >= 75 else "Needs Update" if score >= 50 else "At Risk"
    return {"alignment": alignment, "placement": placement, "employer": employer, "score": score, "status": status, "skills": taught}