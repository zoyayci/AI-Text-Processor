from app.services.text_merge_service import TextMergeService

class FakeLLMService:
    def generate_text(self, prompt: str) -> str:
        return "Mocha is cute but he is too energetic."

def test_merge_returns_merged_text():
    service = TextMergeService(FakeLLMService())
    result = service.merge(
        [
            "Mocha is cute.",
            "He is too energetic.",
        ]
    )
    assert result == (
        "Mocha is cute but he is too energetic."
    )