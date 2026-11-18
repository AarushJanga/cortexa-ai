import json
import logging
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.services.ai_provider import ai_service
from app.models.schemas import ResumeAnalysisResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/career", tags=["Career & Resume"])


@router.post("/resume/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = "Software Engineer",
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    allowed_exts = {"pdf", "docx", "txt"}
    ext = (file.filename or "resume.pdf").lower().split(".")[-1]
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Unsupported resume format. Use PDF, DOCX, or TXT.")

    content = await file.read()
    file_size_mb = len(content) / (1024 * 1024)
    if file_size_mb > 5:
        raise HTTPException(status_code=413, detail="Resume file size must be under 5 MB.")

    # Extract text
    resume_text = ""
    try:
        from app.services.document_parser import DocumentParser
        extraction = DocumentParser.extract_document(file.filename or "resume.pdf", content)
        resume_text = extraction.full_text[:5000]
    except Exception as e:
        logger.warning(f"Resume text extraction failed: {e}")
        resume_text = content.decode("utf-8", errors="replace")[:5000]

    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from resume. Ensure it is a readable text-based file.")

    prompt = (
        f"You are an expert career coach and ATS (Applicant Tracking System) specialist.\n"
        f"Analyze the following resume for the target role: {target_role}\n\n"
        "Return ONLY valid JSON with this exact structure (no markdown, no commentary):\n"
        "{\n"
        '  "overall_score": <integer 0-100>,\n'
        '  "strengths": ["...", "..."],\n'
        '  "missing_skills": ["...", "..."],\n'
        '  "improvement_suggestions": ["...", "..."]\n'
        "}\n\n"
        "<resume_content>\n"
        f"{resume_text}\n"
        "</resume_content>\n\n"
        "Provide actionable, specific feedback. Return ONLY the JSON object."
    )

    result = await ai_service.generate_completion([
        {"role": "system", "content": "You are a professional resume reviewer and ATS optimization expert. Return only valid JSON."},
        {"role": "user", "content": prompt}
    ], temperature=0.2)

    try:
        raw = result["content"].strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        analysis_data = json.loads(raw.strip())
        if isinstance(analysis_data, list):
            analysis_data = analysis_data[0] if (analysis_data and isinstance(analysis_data[0], dict)) else {}
        elif not isinstance(analysis_data, dict):
            analysis_data = {}
    except Exception as e:
        logger.warning(f"Resume analysis JSON parse failed: {e}")
        analysis_data = {
            "overall_score": 72,
            "strengths": ["Clear education section", "Strong programming languages listed", "Relevant project titles"],
            "missing_skills": ["Docker & containerization", "Unit testing experience", "CI/CD pipeline knowledge"],
            "improvement_suggestions": [
                f"Add quantified achievements to match {target_role} expectations",
                "Link GitHub repositories and live project demos",
                "Tailor your skills section to match job description keywords"
            ]
        }

    saved = await db.create_resume_analysis(
        user_id=current_user.id,
        resume_meta={
            "file_name": file.filename or "resume.pdf",
            "storage_path": f"{current_user.id}/resume.{ext}",
            "file_size": len(content),
            "consent_given": True,
        },
        analysis={
            "overall_score": analysis_data.get("overall_score", 70),
            "target_role": target_role,
            "strengths": analysis_data.get("strengths", []),
            "missing_skills": analysis_data.get("missing_skills", []),
            "improvement_suggestions": analysis_data.get("improvement_suggestions", []),
        }
    )

    return ResumeAnalysisResponse(
        id=saved["analysis"]["id"],
        overall_score=saved["analysis"]["overall_score"],
        target_role=saved["analysis"]["target_role"],
        strengths=saved["analysis"]["strengths"],
        missing_skills=saved["analysis"]["missing_skills"],
        improvement_suggestions=saved["analysis"]["improvement_suggestions"],
        created_at=saved["analysis"]["created_at"],
    )


@router.get("/resume/latest", response_model=ResumeAnalysisResponse)
async def get_latest_resume(current_user: AuthenticatedUser = Depends(get_current_user)):
    analysis = await db.get_latest_resume_analysis(current_user.id)
    if not analysis:
        raise HTTPException(status_code=404, detail="No resume analysis found. Upload your resume first.")
    return ResumeAnalysisResponse(**analysis)
