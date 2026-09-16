from app.services.llm_service import LLMService


class TextMergeService:
    def __init__(self, llm_service: LLMService):
        self._llm_service = llm_service

    def merge(self, texts: list[str]) -> str:
        formatted_texts = "\n\n".join(
            f"Text {index + 1}:\n{text}"
            for index, text in enumerate(texts)
        )

        prompt = (
            "Merge the following texts into one coherent text. "
            "Remove redundant information while preserving unique information. "
            "Do not add facts that are not present in the inputs.\n\n"
            f"{formatted_texts}"
        )

        return self._llm_service.generate_text(prompt)