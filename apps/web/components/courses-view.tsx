"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Clock3, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
type Course = { course: string; partner: string; skills: string[]; placement_rate: number; employer_validation: number };

export default function CoursesView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`${API}/api/courses`).then((response) => response.json()).then(setCourses).catch(() => setError("Partner courses could not be loaded.")); }, []);
  return <section className="courses-view">{error && <div className="error-box">{error}</div>}<div className="course-grid">{courses.map((course) => <article className="market-course" key={course.course}><div className="course-top"><span><Sparkles size={14} /> Industry aligned</span><BadgeCheck size={19} color="#4b9b63" /></div><h2>{course.course}</h2><p className="course-partner">by {course.partner}</p><div className="course-skills">{course.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><div className="course-data"><span><Clock3 size={14} /> Partner programme</span><strong>{course.placement_rate}% placement relevance</strong></div><button className={enrolled.includes(course.course) ? "enrolled" : ""} onClick={() => setEnrolled((current) => current.includes(course.course) ? current : [...current, course.course])}>{enrolled.includes(course.course) ? "Enrolled" : "Enroll in course"}</button></article>)}</div>{courses.length === 0 && !error && <div className="loading-box">Loading partner courses...</div>}</section>;
}
