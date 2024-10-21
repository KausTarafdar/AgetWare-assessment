def encode(clear_text: str, shift: int):
    cipher_text_buffer = []
    for ch in clear_text:
        offset = 65 if ch.isupper() else 97
        cipher_text_buffer.append(
            chr(
                (ord(ch) - offset + shift) % 26 + offset
            )
        )

    return ''.join(cipher_text_buffer)

def decode(cipher_text:str, shift: int):
    return encode(cipher_text, -shift)

print(encode("Caeser", 3))
print(decode("Fdhvhu", 3))