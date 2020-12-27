class SingleStockData:
    def __init__(self, link, title, symbol, lastRate, todayChangePrecent):
        self.link = link
        self.title = title
        self.symbol = symbol
        self.lastRate = lastRate
        self.todayChangePrecent = todayChangePrecent

    def createObj(self):
        return {'link': self.link, 'title': self.title, 'symbol': self.symbol, 'lastRate': self.lastRate, 'todayChangePrecent': self.todayChangePrecent}  

class OneStockBigData:
    def __init__(self, lastDay, lastWeek, lastMonth, lastThirtyDays, lastThreeMonths, lastSixMonths, lastNineMonths, 
    lastYear, lastTwoYears, lastThreeYears, lastFiveYears, yearAgoYield, twoYearsAgoYield, threeYearsAgoYield, 
    fourYearsAgoYield, pe, dayChange, currentRate, title, symbol):
        self.lastDay = lastDay
        self.lastWeek = lastWeek
        self.lastMonth = lastMonth
        self.lastThirtyDays = lastThirtyDays
        self.lastThreeMonths = lastThreeMonths
        self.lastSixMonths = lastSixMonths
        self.lastNineMonths = lastNineMonths
        self.lastYear = lastYear
        self.lastTwoYears = lastTwoYears
        self.lastThreeYears = lastThreeYears
        self.lastFiveYears = lastFiveYears
        self.yearAgoYield = yearAgoYield
        self.twoYearsAgoYield = twoYearsAgoYield
        self.threeYearsAgoYield = threeYearsAgoYield
        self.fourYearsAgoYield = fourYearsAgoYield
        self.pe = pe
        self.dayChange = dayChange
        self.currentRate = currentRate
        self.title = title
        self.symbol = symbol

    def createObj(self):
        return {"symbol": self.symbol, "lastDay": self.lastDay, "lastWeek": self.lastWeek, "lastMonth": self.lastMonth,
         "lastThirtyDays": self.lastThirtyDays, "lastThreeMonths": self.lastThreeMonths, "lastSixMonths": self.lastSixMonths, 
         "lastNineMonths": self.lastNineMonths, "lastYear": self.lastYear, "lastTwoYears": self.lastTwoYears,
         "lastThreeYears": self.lastThreeYears, "lastFiveYears": self.lastFiveYears, "yearAgoYield": self.yearAgoYield,
         "twoYearsAgoYield": self.twoYearsAgoYield, "threeYearsAgoYield": self.threeYearsAgoYield, "fourYearsAgoYield": self.fourYearsAgoYield,
         "title": self.title}    



