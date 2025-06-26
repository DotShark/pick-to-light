def get_random_bytes(n):
    try:
        import os
        return os.urandom(n)
    except ImportError:
        from machine import rng
        return bytes([rng() & 0xFF for _ in range(n)])


def uuid4():
    random_bytes = bytearray(get_random_bytes(16))
    random_bytes[6] = (random_bytes[6] & 0x0F) | 0x40
    random_bytes[8] = (random_bytes[8] & 0x3F) | 0x80
    hex_str = ''.join('{:02x}'.format(b) for b in random_bytes)
    return (
        f"{hex_str[0:8]}-"
        f"{hex_str[8:12]}-"
        f"{hex_str[12:16]}-"
        f"{hex_str[16:20]}-"
        f"{hex_str[20:]}"
    )
