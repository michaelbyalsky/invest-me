from fastapi import FastAPI, HTTPException
import uvicorn
import sys
# from models import User_Pydantic, UserIn_Pydantic, Users
# from pydantic import BaseModel

from scrapper import all_stocks, one_stock
# from tortoise.contrib.fastapi import HTTPNotFoundError, register_tortoise
import os

app = FastAPI(title="StockMe API")

@app.get('/')
async def hello():
    return {'hello': 'world'}

@app.get('/stocks-list')
async def stock_list():
    stocks = all_stocks()
    if not stocks:
        return { "error": "error occured"}
    return stocks

@app.get('/all-symbols')
async def get_all_data():
    allStocks = all_stocks()
    allStocksDataArray = []
    for stock in allStocks:
        insert = True
        try:
            ans = one_stock(str(stock['link']))
            ans['symbol'] = stock['link'].split('/')[-1]
        # stockObj['symbol'] = ans['symbol']
        except Exception as e:
            print(e)
            insert = False
        if insert:    
            allStocksDataArray.append(ans)
    return allStocksDataArray



@app.get('/one-stock')
async def get_one_stock(url='https://www.bizportal.co.il/realestates/quote/performance/373019'):
    stock = one_stock(url)
    stock['symbol'] = url.split('/')[-1]
    return stock

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# register_tortoise(
#     app,
#     db_url=f"mysql://root:6425762!Me@localhost:3306/stock_me",
#     modules={"models": ["app.models"]},
#     generate_schemas=True,
#     add_exception_handlers=True,
# )

