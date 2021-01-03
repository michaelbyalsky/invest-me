from fastapi.testclient import TestClient
import sys
sys.path.insert(0, '../src')
from main import app
import os

client = TestClient(app)


def test_check_server():
    check_response = client.get("/")
    assert check_response.status_code == 200
    assert check_response.json() == {"msg": "investMeApi"}


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


# def test_one_stock():
#     response = client.get("/one-stock/")
#     assert response.status_code == 200
#     stocks = response.json()
#     assert len(stocks) == 458     
