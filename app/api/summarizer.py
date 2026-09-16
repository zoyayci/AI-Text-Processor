from fastapi import APIRouter, Depends
from app.api.dependencies import get_summarizer_service
from app.schemas.summarizer import SummarizerRequest, SummarizerResponse
from app.services.summarizer_service import SummarizerService


router = APIRouter(prefix="/text", tags=["text"])


@router.post("/summarizer", response_model=SummarizerResponse)
def summarize(
    request: SummarizerRequest,
    service: SummarizerService = Depends(get_summarizer_service),
):
    summarized_text = service.summarize(request.text)
    return SummarizerResponse(summarized_text=summarized_text)