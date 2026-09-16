from fastapi import APIRouter, Depends
from app.api.dependencies import get_dictionary_service
from app.schemas.dictionary import DictionaryRequest, DictionaryResponse
from app.services.dictionary_service import DictionaryService


router = APIRouter(prefix="/text", tags=["text"])


@router.post("/dictionary", response_model=DictionaryResponse)
def get_definition(
    request: DictionaryRequest,
    service: DictionaryService = Depends(get_dictionary_service),
):
    definition = service.get_definition(request.word)
    return DictionaryResponse(definition=definition)