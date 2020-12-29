from fastapi import FastAPI, HTTPException
import uvicorn
import sys
from scrapper import all_stocks, one_stock
import os

app = FastAPI(title="StockMe API")

@app.get('/')
async def hello():
    return {'msg': 'investMe api'}

@app.get('/stocks-list')
async def stock_list():
    stocks = all_stocks()
    if not stocks:
        return { "error": "error occurred"}
    return stocks

@app.get('/one-stock/')
async def get_one_stock(q: str):
    symbol = q.split('/')[-1]
    stock = one_stock(q, symbol)
    return stock

@app.get('/all-symbols')
async def get_all_data():
    allStocks = all_stocks()
    allStocksDataArray = []
    for stock in allStocks:
        insert = True
        try:
            symbol = stock['link'].split('/')[-1]
            ans = one_stock(str(stock['link']), symbol)
        except Exception as e:
            print(e)
            insert = False
        if insert:    
            allStocksDataArray.append(ans)
    return allStocksDataArray




if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
