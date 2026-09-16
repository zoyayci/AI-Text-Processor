from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_translator_rejects_empty_text():
    response = client.post(
        "/text/translator",
        json={
            "text": "",
            "source_language": "Turkish",
            "target_language": "English",
        },
    )

    assert response.status_code == 422