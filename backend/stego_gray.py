from PIL import Image
import argparse
import os

def int_to_32bits(value: int) -> str:
    if not (0 <= value <= 0xFFFFFFFF):
        raise ValueError("value must fit in 32 bits (0..4294967295)")
    return format(value, '032b')

def bits_to_int(bits: str) -> int:
    if len(bits) != 32 or any(c not in '01' for c in bits):
        raise ValueError("bits must be a 32-character string of '0'/'1'")
    return int(bits, 2)

def ensure_gray(img: Image.Image) -> Image.Image:
    if img.mode != 'L':
        return img.convert('L')
    return img

def encode_uint32_to_image(cover_path: str, value: int, out_path: str) -> None:
    img = Image.open(cover_path)
    img = ensure_gray(img)
    w, h = img.size
    total_pixels = w * h
    if total_pixels < 32:
        raise ValueError(f"Image too small: need at least 32 pixels, got {total_pixels}")

    bits = int_to_32bits(value)
    pixels = img.load()

    bit_idx = 0
    for y in range(h):
        for x in range(w):
            if bit_idx >= 32:
                break
            p = pixels[x, y]
            b = int(bits[bit_idx])
            p = (p & ~1) | b
            pixels[x, y] = p
            bit_idx += 1
        if bit_idx >= 32:
            break

    ext = os.path.splitext(out_path)[1].lower()
    if ext not in ('.png', '.bmp'):
        out_path = os.path.splitext(out_path)[0] + '.png'
    img.save(out_path)
    print(f"Encoded {value} into {out_path}")

def decode_uint32_from_image(stego_path: str) -> int:
    img = Image.open(stego_path)
    img = ensure_gray(img)
    w, h = img.size
    total_pixels = w * h
    if total_pixels < 32:
        raise ValueError(f"Image too small: need at least 32 pixels, got {total_pixels}")

    pixels = img.load()
    bits = []
    bit_idx = 0
    for y in range(h):
        for x in range(w):
            if bit_idx >= 32:
                break
            p = pixels[x, y]
            bits.append(str(p & 1))
            bit_idx += 1
        if bit_idx >= 32:
            break

    value = bits_to_int(''.join(bits))
    return value

'''def main():
    parser = argparse.ArgumentParser(description="Hide/read a 32-bit unsigned integer in a grayscale image using 1 LSB per pixel.")
    sub = parser.add_subparsers(dest='cmd', required=True)

    enc = sub.add_parser('encode', help='encode a 32-bit integer into a cover image')
    enc.add_argument('cover', help='path to cover image (PNG/BMP/JPG; will be converted to grayscale)')
    enc.add_argument('value', type=int, help='unsigned 32-bit integer (0..4294967295)')
    enc.add_argument('out', help='output stego image path (PNG/BMP recommended)')

    dec = sub.add_parser('decode', help='decode the 32-bit integer from a stego image')
    dec.add_argument('stego', help='path to stego image')

    args = parser.parse_args()
    if args.cmd == 'encode':
        encode_uint32_to_image(args.cover, args.value, args.out)
    else:
        v = decode_uint32_from_image(args.stego)
        print(v)

if __name__ == '__main__':
    main()
'''