from app.services.translator_service import TranslatorService


class FakeLLMService:
    def generate_text(self, prompt: str) -> str:
        return "daisy"


def test_translate_returns_translated_text():
    llm_service = FakeLLMService()
    service = TranslatorService(llm_service)

    result = service.translate(
        "papatya",
        "English",
        "Turkish",
    )

    assert result == "daisy"