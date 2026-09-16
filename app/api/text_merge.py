from fastapi import APIRouter, Depends
from app.api.dependencies import get_text_merge_service
from app.schemas.text_merge import TextMergeRequest, TextMergeResponse
from app.services.text_merge_service import TextMergeService

router = APIRouter(prefix="/text", tags=["text"])

@router.post("/merge", response_model=TextMergeResponse)
def merge_text(
    request: TextMergeRequest,
    service: TextMergeService = Depends(get_text_merge_service),
):
    merged_text = service.merge(request.texts)
    return TextMergeResponse(merged_text=merged_text)