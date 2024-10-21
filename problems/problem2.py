def number_toString(val: float):
    s = str(val).split('.');
    a = list(s[0])
    valStr = ''
    for idx, i in enumerate(a[::-1]):
        if(idx < 3):
            valStr = i + valStr
        elif(idx==3):
            valStr = ',' + valStr
        elif(idx > 3):
            if(idx%2):
                valStr = i + valStr
                valStr = ',' + valStr
            else:
                valStr = i + valStr
    return (valStr + '.' + s[1])


print(number_toString(12371149451.232))