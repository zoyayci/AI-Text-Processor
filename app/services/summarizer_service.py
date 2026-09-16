from app.services.llm_service import LLMService


class SummarizerService:
    def __init__(self, llm_service: LLMService):
        self._llm_service = llm_service

    def summarize(self, text: str) -> str:
        prompt = (
            "Summarize the following text clearly and concisely. "
            "Preserve the important information and do not add new facts. "
            "Only respond with the summary.\n\n"
            f"{text}"
        )

        return self._llm_service.generate_text(prompt)
