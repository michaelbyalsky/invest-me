from bs4 import BeautifulSoup
import requests
from models import SingleStockData

headers = {
    'User-Agent': 'My User Agent 1.0',
}

globes_url = "https://www.globes.co.il/portal/quotes/?showAll=true#jt266"


def fetch_data(url):
    try:
        data = requests.get(url, headers=headers)
        return data
    except Exception as e:
        print(e)
        return


def parse_data(data):
    parsed = BeautifulSoup(data, 'html.parser')
    return parsed

# get all israeli stocks from globes website


def all_stocks():
    res = fetch_data(globes_url)
    if not res:
        return
    parsed_data = parse_data(res.text)
    table_rows = get_table_rows(parsed_data)
    stocksArray = get_all_stocks_data(table_rows)
    return stocksArray


def get_all_stocks_data(table_rows):
    stocksArray = []
    for row in table_rows:
        children = row.findChildren('td')
        stockData = parse_stock_data(children)
        stocksArray.append(stockData)
    return stocksArray


def get_table_rows(parsed_data):
    table_rows = parsed_data.findAll('tr', class_='data')
    return table_rows

# parse stock attribute


def parse_stock_data(childred):
    symbol = childred[1].text
    title = childred[0].text
    lastRate = float(childred[3].text.replace(',', ''))
    todayChangePrecent = float(childred[5].text[0:-1])
    newStock = SingleStockData('https://www.bizportal.co.il/realestates/quote/performance/' +
                               symbol, title, symbol, lastRate, todayChangePrecent)
    newStockObj = newStock.createObj()
    return newStockObj

# parse one stock with it all attributes


def one_stock(path, symbol):
    res = fetch_data(path)
    if not res:
        return
    parsedData = parse_data(res.text)
    stockData = {}
    children = create_children_array(parsedData)
    # create stock data obj
    stockData = parse_stock_period(stockData, children)
    stockData = get_title_data(parsedData, stockData)
    # parse additional data
    stockData = get_stock_pe_and_title(parsedData, stockData)
    stockData["symbol"] = symbol
    return stockData

# join attributes from two tables


def create_children_array(parsed_html):
    statsContainer = parsed_html.findAll('table', class_=['table'])
    children1 = statsContainer[0].findChildren('td', class_='num')
    children2 = statsContainer[1].findChildren('td', class_='num')
    children = [*children1, *children2]
    return children


def get_title_data(parsedData, stockData):
    titleWrap = parsedData.find('div', class_='stock_title')
    try:
        stockData['dayChange'] = float(titleWrap.find(
            'span', class_=['percent']).text[0:-1].replace(',', ''))
    except:
        stockData['dayChange'] = None
    try:
        stockData['currentRate'] = float(titleWrap.find(
            'span', class_='num').text.replace(',', ''))
    except:
        stockData['currentRate'] = None
    return stockData


def get_stock_pe_and_title(parsedData, stockData):
    try:
        stockData['pe'] = float(parsedData.find('div', class_='statistics-container').findChildren(
            'li')[-1].findChildren('span')[-1].text.replace(',', ''))
    except:
        stockData['pe'] = 0
    try:
        stockData['title'] = parsedData.find('span', class_='paper-name').text
    except:
        stockData['title'] = None
    return stockData


# get all stock changes for certain period
def parse_stock_period(stockData, childred):
    attributes_array = ['lastDay', 'lastWeek', 'lastMonth', 'lastThirtyDays', 'lastThreeMonth', 'lastSixMonths', 'lastNineMonths',
                        'lastYear', 'lastTwelveMonths', 'lastTwoYears', 'lastThreeYears', 'lastFiveYears', 'yearAgoYield', 'twoYearsAgoYield',
                        'threeYearsAgoYield', 'fourYearsAgoYield']
    for i in range(len(attributes_array)):
        try:
            stockData[attributes_array[i]] = float(
                childred[i].text.replace(',', ''))
        except:
            stockData[i] = None
    return stockData
