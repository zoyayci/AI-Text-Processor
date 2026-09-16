from typing import Annotated
from pydantic import BaseModel, StringConstraints

NonEmptyText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1),
]

class SummarizerRequest(BaseModel):
    text: NonEmptyText

class SummarizerResponse(BaseModel):
    summarized_text: str