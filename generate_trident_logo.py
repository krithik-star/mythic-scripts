import math
from PIL import Image, ImageDraw, ImageFilter

size = 512
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))

# 1. Circular gradient background
bg = Image.new('RGBA', (size, size), (0, 0, 0, 0))
bg_draw = ImageDraw.Draw(bg)

cx, cy = size // 2, size // 2
radius = 236

# Draw gradient circle
for r in range(radius, 0, -1):
    t = (radius - r) / radius
    # Gradient from center bright gold (#FBBF24) to outer rich orange (#D97706)
    red = int(217 * (1 - t) + 251 * t)
    green = int(119 * (1 - t) + 191 * t)
    blue = int(6 * (1 - t) + 36 * t)
    bg_draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(red, green, blue, 255))

# Subtle outer ring
bg_draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=(255, 230, 150, 180), width=6)

# 2. Draw sharp, elegant golden Trishul
fg = Image.new('RGBA', (size, size), (0, 0, 0, 0))
fg_draw = ImageDraw.Draw(fg)

gold_light = (255, 253, 235, 255)
gold_mid = (254, 230, 138, 255)
gold_dark = (245, 158, 11, 255)

# Center prongs and curves matching the uploaded trident
# Middle spear
# Tip at (256, 110)
# Base at (256, 350)
mid_spear = [
    (256, 110), # top tip
    (240, 145), # spear barb left
    (248, 142), # inner left
    (248, 350), # stem bottom left
    (264, 350), # stem bottom right
    (264, 142), # inner right
    (272, 145), # spear barb right
]
fg_draw.polygon(mid_spear, fill=gold_light, outline=gold_dark)

# Left wing curved prong
# Outer tip at (165, 135)
left_prong = [
    (165, 135), # tip
    (150, 158), # barb outer
    (158, 160), # barb inner
    (158, 220), # curve down outer
    (185, 290), # bottom curve outer
    (248, 340), # connects to center stem
    (248, 315), # inner connection
    (195, 270), # curve inner
    (178, 215), # curve inner
    (178, 160), # inner barb
    (186, 158), # tip inner
]
fg_draw.polygon(left_prong, fill=gold_mid, outline=gold_dark)

# Right wing curved prong (mirror of left)
right_prong = [
    (512 - 165, 135),
    (512 - 150, 158),
    (512 - 158, 160),
    (512 - 158, 220),
    (512 - 185, 290),
    (512 - 248, 340),
    (512 - 248, 315),
    (512 - 195, 270),
    (512 - 178, 215),
    (512 - 178, 160),
    (512 - 186, 158),
]
fg_draw.polygon(right_prong, fill=gold_mid, outline=gold_dark)

# Pedestal / base collar at (256, 365)
base_pedestal = [
    (230, 352),
    (282, 352),
    (275, 375),
    (237, 375)
]
fg_draw.polygon(base_pedestal, fill=gold_light, outline=gold_dark)

# Add subtle drop shadow to trident
shadow = fg.filter(ImageFilter.GaussianBlur(8))
final_img = Image.alpha_composite(bg, shadow)
final_img = Image.alpha_composite(final_img, fg)

# Save high-res logo
dest_path = r'C:\Users\Nishanth\.gemini\antigravity\scratch\mythology-ai-studio\assets\trident_logo.png'
final_img.save(dest_path)
# Also copy to krithik_naik_logo.png
final_img.save(r'C:\Users\Nishanth\.gemini\antigravity\scratch\mythology-ai-studio\assets\krithik_naik_logo.png')
final_img.save(r'C:\Users\Nishanth\.gemini\antigravity\scratch\mythology-ai-studio\assets\sacred_lore_logo.png')

print('Generated crisp 512x512 trident logo!')
