from app.services.llm_service import LLMService


class GrammarFixService:
    def __init__(self, llm_service: LLMService):
        self._llm_service = llm_service

    def fix_grammar(self, text: str) -> str:
        prompt = (
            "Fix the grammar and spelling of the following text. "
            "Do not change the meaning of the text. "
            "Only respond with the corrected text.\n\n"
            f"{text}"
        )

        return self._llm_service.generate_text(prompt)