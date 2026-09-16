from fastapi import APIRouter, Depends
from app.api.dependencies import get_grammar_fix_service
from app.schemas.grammar_fix import GrammarFixRequest, GrammarFixResponse
from app.services.grammar_fix_service import GrammarFixService


router = APIRouter(prefix="/text", tags=["text"])


@router.post("/grammar-fix", response_model=GrammarFixResponse)
def fix_grammar(
    request: GrammarFixRequest,
    service: GrammarFixService = Depends(get_grammar_fix_service),
):
    corrected_text = service.fix_grammar(request.text)
    return GrammarFixResponse(corrected_text=corrected_text)