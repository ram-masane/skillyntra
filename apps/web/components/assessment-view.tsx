"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
type Question = { id: number; question: string; options: string[]; skill: string };
type Result = { score: number; passed: boolean; demonstrated: string[]; improvement: string[] };

export default function AssessmentView() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`${API}/api/assessments/demo`).then((response) => response.json()).then((data) => setQuestions(data.questions)).catch(() => setError("Assessment could not be loaded.")); }, []);
  async function submit() { const response = await fetch(`${API}/api/assessments/demo/grade`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) }); if (response.ok) setResult(await response.json()); else setError("Assessment could not be submitted."); }
  return <section className="assessment-view">{error && <div className="error-box">{error}</div>}{result ? <div className={result.passed ? "result-box pass" : "result-box fail"}><div className="result-icon">{result.passed ? <CheckCircle2 /> : <CircleAlert />}</div><div className="panel-kicker">Assessment result</div><h2>{result.score}% · {result.passed ? "Passed" : "Needs another attempt"}</h2><p>{result.passed ? "Your result is ready to become an Industry Validated skill signal." : "Review the improvement areas and try again."}</p><div className="result-columns"><div><b>Skills demonstrated</b>{result.demonstrated.map((skill) => <span key={skill}>{skill}</span>)}</div><div><b>Needs improvement</b>{result.improvement.map((skill) => <span key={skill}>{skill}</span>)}</div></div><button onClick={() => { setResult(null); setAnswers({}); }}>Retake assessment</button></div> : <div className="assessment-card"><div className="panel-kicker">Company assessment · 5 questions</div><h2>Python for Data Analysis</h2><p>Answer the questions to demonstrate skills connected to the partner assessment.</p>{questions.map((question) => <fieldset key={question.id}><legend>{question.id}. {question.question}</legend>{question.options.map((option) => <label key={option}><input type="radio" name={`question-${question.id}`} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} />{option}</label>)}</fieldset>)}<button disabled={Object.keys(answers).length !== questions.length} onClick={submit}>Submit assessment</button></div>}</section>;
}
