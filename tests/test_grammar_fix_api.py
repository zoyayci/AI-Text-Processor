from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_grammar_fix_rejects_empty_text():
    response = client.post(
        "/text/grammar-fix",
        json={"text": ""},
    )
    assert response.status_code == 422