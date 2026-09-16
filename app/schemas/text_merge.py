from typing import Annotated
from pydantic import BaseModel, Field, StringConstraints

NonEmptyText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1),
]

class TextMergeRequest(BaseModel):
    texts: list[NonEmptyText] = Field(min_length=2, max_length=5) # merge at least 2 max 5 texts 

class TextMergeResponse(BaseModel):
    merged_text: str