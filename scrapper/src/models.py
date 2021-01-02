class SingleStockData:
    def __init__(self, link, title, symbol, lastRate, todayChangePrecent):
        self.link = link
        self.title = title
        self.symbol = symbol
        self.lastRate = lastRate
        self.todayChangePrecent = todayChangePrecent

    def createObj(self):
        return {'link': self.link, 'title': self.title, 'symbol': self.symbol, 'lastRate': self.lastRate, 'todayChangePrecent': self.todayChangePrecent}


