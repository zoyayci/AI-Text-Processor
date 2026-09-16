from typing import Annotated
from pydantic import BaseModel, Field, StringConstraints

NonEmptyText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1),
]

class TranslateRequest(BaseModel):
    text: NonEmptyText
    target_language: NonEmptyText
    source_language: NonEmptyText

class TranslateResponse(BaseModel):
    translated_text: str