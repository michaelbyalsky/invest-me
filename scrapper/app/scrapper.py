from bs4 import BeautifulSoup
import requests
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

def all_stocks():
    res = fetch_data(globes_url)
    if not res: 
        return 
    parsed_data = parse_data(res.text)
    table_rows = parsed_data.findAll('tr', class_='data')
    stocksArray = []
    for row in table_rows:
        children = row.findChildren('td')
        stockData = parse_stock_data(children)
        stocksArray.append(stockData)
    return stocksArray

def parse_stock_data(childred):
    symbol = childred[1].text
    title = childred[0].text
    lastRate = float(childred[3].text.replace(',', ''))
    todayChangePrecent = float(childred[5].text[0:-1])
    return {'link': 'https://www.bizportal.co.il/realestates/quote/performance/' + symbol, 'title': title, 'symbol': symbol, 'lastRate': lastRate, 'todayChangePrecent': todayChangePrecent}


def one_stock(path):
    res = fetch_data(path)
    try:    
        parsedData = parse_data(res.text)
    except Exception as e:
        print(e)
        return
    statsContainer = parsedData.findAll('table', class_=['table'])
    children1 = statsContainer[0].findChildren('td', class_='num')
    children2 = statsContainer[1].findChildren('td', class_='num')
    children = [*children1, *children2]
    stockData = parse_extra_content(children)
    titleWrap = parsedData.find('div', class_='stock_title')
    try:
        stockData['pe'] = float(parsedData.find('div', class_='statistics-container').findChildren('li')[-1].findChildren('span')[-1].text.replace(',', ''))
    except:
        stockData['pe'] = 0
    try: 
        stockData['dayChange'] = float(titleWrap.find('span', class_=['percent']).text[0:-1].replace(',', ''))
    except:
        stockData['dayChange'] = None
    try:
        stockData['currentRate'] = float(titleWrap.find('span', class_='num').text.replace(',', ''))
    except:
        stockData['currentRate'] = None
    stockData['title'] = parsedData.find('span', class_='paper-name').text
    return stockData

def parse_extra_content(childred):
    attributes_array = ['lastDay', 'lastWeek', 'lastMonth', 'lastThirtyDays', 'lastThreeMonth', 'lastSixMonths', 'lastNineMonths',
     'lastYear', 'lastTwelveMonths', 'lastTwoYears', 'lastThreeYears', 'lastFiveYears', 'yearAgoYield', 'twoYearsAgoYield', 
     'threeYearsAgoYield', 'fourYearsAgoY']
    stockData = {}
    for i in range(len(attributes_array)):
        try:
            stockData[attributes_array[i]] = float(childred[i].text.replace(',', ''))
        except:
            stockData[i] = None
    return stockData    
