import sys
sys.path.insert(0, '../src')
from functions import (fetch_data, parse_data, get_table_rows, 
get_all_stocks_data, create_children_array, parse_stock_period, get_title_data, get_stock_pe_and_title) 


globes_url = "https://www.globes.co.il/portal/quotes/?showAll=true#jt266"
one_stock_url = "https://www.bizportal.co.il/realestates/quote/performance/373019"
attributes_array = ['lastDay', 'lastWeek', 'lastMonth', 'lastThirtyDays', 'lastThreeMonth', 'lastSixMonths', 'lastNineMonths',
                        'lastYear', 'lastTwelveMonths', 'lastTwoYears', 'lastThreeYears', 'lastFiveYears', 'yearAgoYield', 'twoYearsAgoYield',
                        'threeYearsAgoYield', 'fourYearsAgoYield']

def test_fetch_data():
    html = fetch_data(globes_url)
    assert html.status_code == 200

def test_get_and_parse_all_stocks():
    html = fetch_data(globes_url)
    pasred_html = parse_data(html.text)
    table_rows = get_table_rows(pasred_html)
    assert len(table_rows) >= 457
    data = get_all_stocks_data(table_rows)
    assert len(table_rows) == len(data)
    assert data[0]["link"] == one_stock_url
    assert data[0]["title"] == "אאורה"
    assert data[0]["symbol"] == "373019"
    assert type(data[0]["lastRate"]) == float
    assert type(data[0]["todayChangePrecent"]) == float

def test_get_and_parse_one_stock():
    html = fetch_data(one_stock_url)
    pasred_html = parse_data(html.text)
    children = create_children_array(pasred_html)
    assert len(children) == 17
    periodData = parse_stock_period({}, children)
    for periodName, periodValue in periodData.items():
        assert periodName in attributes_array
        assert type(periodValue) == float
    titleData = get_title_data(pasred_html, {})
    for data in titleData.values():
        assert type(data) == float
    pe_and_title = get_stock_pe_and_title(pasred_html, {})
    assert pe_and_title["title"] == "אאורה"
    assert type(pe_and_title["pe"]) == float




    



