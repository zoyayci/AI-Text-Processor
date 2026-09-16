from app.services.summarizer_service import SummarizerService


class FakeLLMService:
    def generate_text(self, prompt: str) -> str:
        return "This is the summary."


def test_summarize_returns_summary():
    llm_service = FakeLLMService()
    service = SummarizerService(llm_service)

    result = service.summarize(
        "This is a long piece of text that needs summarizing."
    )

    assert result == "This is the summary."