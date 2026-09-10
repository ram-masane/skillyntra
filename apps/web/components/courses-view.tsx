"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Clock3, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
type Course = { id: number; course: string; partner: string; skills: string[]; placement_rate: number; employer_validation: number };
type Enrollment = { course_id: number; course: string; enrolled_at: string };

export default function CoursesView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolled, setEnrolled] = useState<number[]>([]);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/courses`),
      fetch(`${API}/api/courses/enrollments?student_id=demo-student`),
    ])
      .then(async ([coursesResponse, enrollmentsResponse]) => {
        if (!coursesResponse.ok || !enrollmentsResponse.ok) throw new Error();
        const loadedCourses: Course[] = await coursesResponse.json();
        const enrollments: Enrollment[] = await enrollmentsResponse.json();
        setCourses(loadedCourses);
        setEnrolled(enrollments.map((enrollment) => enrollment.course_id));
      })
      .catch(() => setError("Partner courses could not be loaded."));
  }, []);

  async function enroll(courseId: number) {
    setEnrolling(courseId);
    setError("");
    try {
      const response = await fetch(`${API}/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: "demo-student" }),
      });
      if (!response.ok) throw new Error();
      setEnrolled((current) => current.includes(courseId) ? current : [...current, courseId]);
    } catch {
      setError("Enrollment could not be saved. Please try again.");
    } finally {
      setEnrolling(null);
    }
  }

  return <section className="courses-view">{error && <div className="error-box">{error}</div>}<div className="course-grid">{courses.map((course) => { const isEnrolled = enrolled.includes(course.id); return <article className="market-course" key={course.id}><div className="course-top"><span><Sparkles size={14} /> Industry aligned</span><BadgeCheck size={19} color="#4b9b63" /></div><h2>{course.course}</h2><p className="course-partner">by {course.partner}</p><div className="course-skills">{course.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><div className="course-data"><span><Clock3 size={14} /> Partner programme</span><strong>{course.placement_rate}% placement relevance</strong></div><button className={isEnrolled ? "enrolled" : ""} disabled={isEnrolled || enrolling === course.id} onClick={() => enroll(course.id)}>{isEnrolled ? "Enrolled" : enrolling === course.id ? "Saving..." : "Enroll in course"}</button></article>; })}</div>{courses.length === 0 && !error && <div className="loading-box">Loading partner courses...</div>}</section>;
}
