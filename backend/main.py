from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import os
from io import BytesIO

from stego_color import encode_uint32_to_color_image_file, decode_uint32_from_color_image_file
from stego_strings import encode_string_to_image, decode_string_from_image
from stego_pattern import encode_character, decode_character

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/encode/color")
async def encode_color_route(image: UploadFile = File(...), message: str = Form(...)):
    img = Image.open(BytesIO(await image.read()))
    value = int(message)                
    stego = encode_uint32_to_color_image_file(img, value)

    out = os.path.join(UPLOAD_DIR, f"color_{image.filename}")
    stego.save(out)

    return FileResponse(out)


@app.post("/decode/color")
async def decode_color_route(image: UploadFile = File(...)):
    img = Image.open(BytesIO(await image.read()))
    value = decode_uint32_from_color_image_file(img)
    return JSONResponse({"message": str(value)})


@app.post("/encode/strings")
async def encode_string_route(image: UploadFile = File(...), message: str = Form(...)):
    img = Image.open(BytesIO(await image.read()))
    stego = encode_string_to_image(img, message)

    out = os.path.join(UPLOAD_DIR, f"strings_{image.filename}")
    stego.save(out)

    return FileResponse(out)


@app.post("/decode/strings")
async def decode_string_route(image: UploadFile = File(...)):
    img = Image.open(BytesIO(await image.read()))
    msg = decode_string_from_image(img)
    return JSONResponse({"message": msg})



@app.post("/encode/pattern")
async def encode_pattern_route(image: UploadFile = File(...), message: str = Form(...)):
    img = Image.open(BytesIO(await image.read()))
    char = message[0]     # only first character encoded
    stego, coords = encode_character(img, char)

    out = os.path.join(UPLOAD_DIR, f"pattern_{image.filename}")
    stego.save(out)

    return FileResponse(out)


@app.post("/decode/pattern")
async def decode_pattern_route(image: UploadFile = File(...)):
    img = Image.open(BytesIO(await image.read()))
    char = decode_character(img)
    return JSONResponse({"message": char})
