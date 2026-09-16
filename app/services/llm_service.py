from openai import OpenAI

from app.core.config import Settings


class LLMService:
    def __init__(self, settings: Settings):
        self._client = OpenAI(
            api_key=settings.llm_api_key.get_secret_value()
        )
        self._model = settings.llm_model

    def generate_text(self, prompt: str) -> str:
        response = self._client.responses.create(
            model=self._model,
            input=prompt,
        )

        return response.output_text