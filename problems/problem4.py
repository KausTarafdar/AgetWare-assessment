def minimize_loss_optimized(prices, n):
    min_loss = float('inf')
    buy_year = -1
    sell_year = -1

    price_year_pairs = sorted((prices[i], i) for i in range(n))

    print(price_year_pairs)
    for i in range(1, n):
        current_price, current_year = price_year_pairs[i]
        previous_price, previous_year = price_year_pairs[i - 1]

        if current_year < previous_year:
            loss = previous_price - current_price
            if loss < min_loss:
                min_loss = loss
                buy_year = previous_year + 1
                sell_year = current_year + 1

    return buy_year, sell_year, min_loss

# Example usage
prices = [20, 15, 7, 2, 13]
n = len(prices)
buy_year, sell_year, loss = minimize_loss_optimized(prices, n)
print(f"Buy in year {buy_year}, sell in year {sell_year}, loss: {loss}")
