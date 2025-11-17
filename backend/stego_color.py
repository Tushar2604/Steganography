from PIL import Image
import os

def encode_uint32_to_color_image_file(img: Image.Image, value: int) -> Image.Image:
    img = img.convert("RGB")
    w, h = img.size
    pixels = img.load()
    bits = format(value, '032b')
    bit_idx = 0

    for y in range(h):
        for x in range(w):
            if bit_idx >= 32:
                break
            r, g, b = pixels[x, y]
            for channel in ['r', 'g', 'b']:
                if bit_idx >= 32:
                    break
                b_val = int(bits[bit_idx])
                if channel == 'r':
                    r = (r & ~1) | b_val
                elif channel == 'g':
                    g = (g & ~1) | b_val
                else:
                    b = (b & ~1) | b_val
                bit_idx += 1
            pixels[x, y] = (r, g, b)
        if bit_idx >= 32:
            break
    return img

def decode_uint32_from_color_image_file(img: Image.Image) -> int:
    img = img.convert("RGB")
    pixels = img.load()
    w, h = img.size
    bits = []
    bit_idx = 0

    for y in range(h):
        for x in range(w):
            if bit_idx >= 32:
                break
            r, g, b = pixels[x, y]
            for channel in (r, g, b):
                if bit_idx < 32:
                    bits.append(str(channel & 1))
                    bit_idx += 1
        if bit_idx >= 32:
            break
    return int(''.join(bits), 2)