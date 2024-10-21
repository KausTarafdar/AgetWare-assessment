def combine_lists(list1, list2):
    combined = []
    i, j = 0, 0

    def is_overlap(e1, e2):
        l1, r1 = e1['positions']
        l2, r2 = e2['positions']
        len1 = r1 - l1
        len2 = r2 - l2
        overlap = max(0, min(r1, r2) - max(l1, l2))
        return overlap > (min(len1, len2) / 2)

    while i < len(list1) and j < len(list2):
        e1 = list1[i]
        e2 = list2[j]

        if is_overlap(e1, e2):
            combined_values = e1['values'] + e2['values']
            combined.append({'positions': e1['positions'], 'values': combined_values})
            i += 1
            j += 1
        elif e1['positions'][0] < e2['positions'][0]:
            combined.append(e1)
            i += 1
        else:
            combined.append(e2)
            j += 1

    combined.extend(list1[i:])
    combined.extend(list2[j:])

    return combined

list1 = [
    {"positions": [1, 5], "values": [10]},
    {"positions": [6, 10], "values": [20]}
]

list2 = [
    {"positions": [2, 7], "values": [30]},
    {"positions": [8, 12], "values": [40]}
]

print(combine_lists(list1, list2))
