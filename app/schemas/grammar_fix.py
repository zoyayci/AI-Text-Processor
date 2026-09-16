from typing import Annotated
from pydantic import BaseModel, Field, StringConstraints

NonEmptyText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1),
]

class GrammarFixRequest(BaseModel):
    text: NonEmptyText

class GrammarFixResponse(BaseModel):
    corrected_text: str