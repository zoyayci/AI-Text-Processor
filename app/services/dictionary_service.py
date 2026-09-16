from app.services.llm_service import LLMService


class DictionaryService:
    def __init__(self, llm_service: LLMService):
        self._llm_service = llm_service

    def get_definition(self, word: str) -> str:
        prompt = (
            "Provide the definition of the following word/phrase in the language of the word/phrase. "
            "Only respond with the definition and a single example. "
            "Format the response as follows: Definition: <definition>\nExample: <example> \n\n"
            f"{word}"
        )
        return self._llm_service.generate_text(prompt)
