from PIL import Image, ImageDraw, ImageFont

def generate_pattern_coordinates(img: Image.Image, char: str):
    w, h = img.size
    temp = Image.new("1", (w, h), 0)
    draw = ImageDraw.Draw(temp)

    font_size = min(w, h) // 2
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

    draw.text((0, 0), char, fill=1, font=font)

    coords = []
    pixels = temp.load()
    for y in range(h):
        for x in range(w):
            if pixels[x, y] == 1:
                coords.append((x, y))
    return coords

def print_pattern_in_terminal(coords):
    if not coords:
        print("No pattern to print")
        return

    min_x = min(x for x, y in coords)
    max_x = max(x for x, y in coords)
    min_y = min(y for x, y in coords)
    max_y = max(y for x, y in coords)

    canvas = {}
    for x, y in coords:
        canvas[(x, y)] = "*"

    for y in range(min_y, max_y + 1):
        line = ""
        for x in range(min_x, max_x + 1):
            line += canvas.get((x, y), " ")
        print(line)

def encode_character(img: Image.Image, char: str) -> Image.Image:
    img = img.convert("RGB")
    pixels = img.load()
    w, h = img.size

    ascii_val = ord(char)
    bits = format(ascii_val, "08b")
    bit_idx = 0
    for y in range(h):
        for x in range(w):
            if bit_idx >= 8:
                break
            r, g, b = pixels[x, y]
            r = (r & ~1) | int(bits[bit_idx])
            pixels[x, y] = (r, g, b)
            bit_idx += 1
        if bit_idx >= 8:
            break

    pattern_coords = generate_pattern_coordinates(img, char)
    for (x, y) in pattern_coords:
        r, g, b = pixels[x, y]
        r = r | 1
        pixels[x, y] = (r, g, b)

    print_pattern_in_terminal(pattern_coords)

    return img, pattern_coords

def decode_character(img: Image.Image) -> str:
    img = img.convert("RGB")
    pixels = img.load()
    w, h = img.size

    bits = ""
    bit_idx = 0
    for y in range(h):
        for x in range(w):
            if bit_idx >= 8:
                break
            r, g, b = pixels[x, y]
            bits += str(r & 1)
            bit_idx += 1
        if bit_idx >= 8:
            break

    ascii_val = int(bits, 2)
    char = chr(ascii_val)
    return char