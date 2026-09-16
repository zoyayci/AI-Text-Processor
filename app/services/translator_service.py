from app.services.llm_service import LLMService


class TranslatorService:
    def __init__(self, llm_service: LLMService):
        self._llm_service = llm_service

    def translate(self, text: str, target_language: str, source_language: str) -> str:
        prompt = (
            f"Translate the following text from {source_language} to {target_language}. "
            "Do not add any explanations or additional text. "
            "Only respond with the translated text.\n\n"
            f"{text}"
        )

        return self._llm_service.generate_text(prompt)