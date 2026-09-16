from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_text_merge_rejects_single_text():
    response = client.post(
        "/text/merge",
        json={"texts": ["Only one text"]},
    )
    assert response.status_code == 422