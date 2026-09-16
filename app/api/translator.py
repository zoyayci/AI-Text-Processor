from fastapi import APIRouter, Depends
from app.api.dependencies import get_translator_service
from app.schemas.translator import TranslateRequest, TranslateResponse
from app.services.translator_service import TranslatorService

router = APIRouter(prefix="/text", tags=["text"])

@router.post("/translator", response_model=TranslateResponse)
def translate_text(
    request: TranslateRequest,
    service: TranslatorService = Depends(get_translator_service),
):
    translated_text = service.translate(request.text, request.target_language, request.source_language)
    return TranslateResponse(translated_text=translated_text)