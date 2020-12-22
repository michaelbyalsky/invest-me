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

def parse_data(data):
    parsed = BeautifulSoup(data, 'html.parser')
    return parsed

def parse_stock_data(childred):
    symbol = childred[1].text
    title = childred[0].text
    lastRate = float(childred[3].text.replace(',', ''))
    todayChangePrecent = float(childred[5].text[0:-1])
    return {'link': 'https://www.bizportal.co.il/realestates/quote/performance/' + symbol, 'title': title, 'symbol': symbol, 'lastRate': lastRate, 'todayChangePrecent': todayChangePrecent}

def parse_one_stock_data(childred):
    stockData = {}
    try:
        stockData['lastDay'] = float(childred[0].text.replace(',', ''))
    except:
        stockData['lastDay'] = None
    try:   
        stockData['lastWeek'] = float(childred[1].text.replace(',', ''))
    except:
        stockData['lastWeek'] = None
    try:    
        stockData['lastMonth'] = float(childred[2].text.replace(',', ''))
    except:
        stockData['lastMonth'] = None
    try:    
        stockData['lastThirtyDays'] = float(childred[3].text.replace(',', ''))
    except:
        stockData['lastThirtyDays'] = None
    try:  
        stockData['lastThreeMonth'] = float(childred[4].text.replace(',', ''))
    except:
        stockData['lastThreeMonth'] = None
    try:        
        stockData['lastSixMonths'] = float(childred[5].text.replace(',', ''))
    except:
        stockData['lastSixMonths'] = None     
    try:
        stockData['lastNineMonths'] = float(childred[6].text.replace(',', ''))
    except:
        stockData['lastNineMonths'] = None
    try:
        stockData['lastYear'] = float(childred[7].text.replace(',', ''))
    except:
        stockData['lastYear'] = None
    try:
        stockData['lastTwelveMonths'] = float(childred[8].text.replace(',', ''))
    except:
        stockData['lastTwelveMonths'] = None
    try:
        stockData['lastTwoYears'] = float(childred[9].text.replace(',', ''))
    except:
        stockData['lastTwoYears'] = None
    try:
        stockData['lastThreeYears'] = float(childred[10].text.replace(',', ''))
    except:
        stockData['lastThreeYears'] = None
    try:
        stockData['lastFiveYears'] = float(childred[11].text.replace(',', ''))
    except:
        stockData['lastFiveYears'] = None
    try:
        stockData['yearAgoYield'] = float(childred[12].text.replace(',', ''))
    except:
        stockData['yearAgoYield'] = None
    try:
        stockData['twoYearsAgoYield'] = float(childred[13].text.replace(',', ''))
    except:
        stockData['twoYearsAgoYield'] = None
    try:
        stockData['threeYearsAgoYield'] = float(childred[14].text.replace(',', ''))
    except:
        stockData['threeYearsAgoYield'] = None
    try:
        stockData['fourYearsAgoYield'] = float(childred[15].text.replace(',', ''))
    except:
        stockData['fourYearsAgoYield'] = None
    return stockData    
    # return { 'current_value': 0, 'last_week': last_week, 'last_month': last_month, 'last_thirty_days': last_thirty_days, 'last_three_month': last_three_month, 'last_six_months': last_six_months, last_nine_months: last_nine_months, last_year: last_year}

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
    stockData = parse_one_stock_data(children)
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

