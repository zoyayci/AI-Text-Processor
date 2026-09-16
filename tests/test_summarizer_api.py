from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_summarizer_rejects_empty_text():
    response = client.post(
        "/text/summarizer",
        json={
            "text": "",
        },
    )

    assert response.status_code == 422