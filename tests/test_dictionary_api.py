from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_dictionary_rejects_empty_word():
    response = client.post(
        "/text/dictionary",
        json={
            "word": "",
        },
    )

    assert response.status_code == 422