from typing import Annotated
from pydantic import BaseModel, StringConstraints

NonEmptyText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1),
]

class DictionaryRequest(BaseModel):
    word: NonEmptyText

class DictionaryResponse(BaseModel):
    definition: str