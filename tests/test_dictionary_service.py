from app.services.dictionary_service import DictionaryService


class FakeLLMService:
    def generate_text(self, prompt: str) -> str:
        return (
            "Definition: Commonly used or well-known.\n"
            "Example: The proverbial last straw."
        )


def test_get_definition_returns_definition():
    llm_service = FakeLLMService()
    service = DictionaryService(llm_service)

    result = service.get_definition("proverbial")

    assert result == (
        "Definition: Commonly used or well-known.\n"
        "Example: The proverbial last straw."
    )