from app.services.grammar_fix_service import GrammarFixService

class FakeLLMService:
    def generate_text(self, prompt: str) -> str:
        return "Sirius fetched the ball."

def test_fix_grammar_returns_corrected_text():
    service = GrammarFixService(FakeLLMService())

    result = service.fix_grammar(
        "sirius fetch the ball."
    )

    assert result == "Sirius fetched the ball."