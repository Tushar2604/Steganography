from email import message
from PIL import Image

def int_to_bits(value: int, bit_length: int) -> str:
    return format(value, f'0{bit_length}b')

def bits_to_int(bits: str) -> int:
    return int(bits, 2)

def encode_string_to_image(img: Image.Image, text: str) -> Image.Image:
    img = img.convert("RGB")
    pixels = img.load()
    w, h = img.size

    data = text.encode('utf-8')
    length = len(data)
    length_bits = int_to_bits(length, 32)
    message_bits = ''.join([int_to_bits(b, 8) for b in data])
    bits = length_bits + message_bits

    if len(bits) > w * h * 3:
        raise ValueError("Text is too long to hide in the image")
        
    bit_idx = 0
    for y in range(h):
        for x in range(w):
            if bit_idx >= len(bits):
                break
            r, g, b = pixels[x, y]
            for channel in ['r', 'g', 'b']:
                if bit_idx >= len(bits):
                    break
                bit_val = int(bits[bit_idx])
                if channel == 'r':
                    r = (r & ~1) | bit_val
                elif channel == 'g':
                    g = (g & ~1) | bit_val
                else:
                    b = (b & ~1) | bit_val
                bit_idx += 1
            pixels[x, y] = (r, g, b)
        if bit_idx >= len(bits):
            break
    return img

def decode_string_from_image(img: Image.Image) -> str:
    img = img.convert("RGB")
    pixels = img.load()
    w, h = img.size

    bits = []
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            for channel in (r, g, b):
                bits.append(str(channel & 1))
    
    length = bits_to_int(''.join(bits[:32]))
    message_bits = bits[32:32 + length * 8]

    data = bytearray()
    for i in range(0, len(message_bits), 8):
        byte = bits_to_int(''.join(message_bits[i:i+8]))
        data.append(byte)
    
    return data.decode('utf-8', errors="ignore")