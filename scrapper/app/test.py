from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "investMeApi"}


def test_stocks_list():
    response = client.get("/stocks-list")
    assert response.status_code == 200
    stocks = response.json()
    assert len(stocks) == 458 


# def test_all_symbols():
#     response = client.get("/all-symbols")
#     assert response.status_code == 200
#     stocks = response.json()
#     assert len(stocks) == 454     


def test_one_stock():
    response = client.get("/one-stock/")
    assert response.status_code == 200
    stocks = response.json()
    assert len(stocks) == 458     
