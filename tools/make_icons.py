import math
from PIL import Image, ImageDraw

def create_crisp_vortex_icon(size=512):
    """
    Creates an ultra-sharp, high-contrast download accelerator icon:
    - Transparent background (sits cleanly on any Windows taskbar)
    - Electric Cyan (#00F2FE) & Vibrant Cobalt Blue (#2563EB) Shield/Circle
    - Bold, Pure White (#FFFFFF) Downward Turbo Arrow with sharp angles
    - High-visibility geometry designed specifically for 16px-48px scaling
    """
    scale = 2
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = canvas_size / 2.0
    radius = (canvas_size / 2.0) - (20 * scale)

    # 1. Outer Glow / Ring (Vibrant Gradient Circle)
    # Background circle: Vibrant Electric Blue to Cyan
    steps = 40
    for i in range(steps):
        r = radius - (i * 1.2 * scale)
        if r <= 0:
            break
        factor = i / float(steps)
        # Interpolate from Neon Cyan (0, 242, 254) to Deep Royal Blue (15, 23, 42)
        red = int(0 * (1 - factor) + 12 * factor)
        green = int(242 * (1 - factor) + 25 * factor)
        blue = int(254 * (1 - factor) + 60 * factor)
        draw.ellipse([center - r, center - r, center + r, center + r], fill=(red, green, blue, 255))

    # Bright Cyan Boundary Border
    draw.ellipse([center - radius, center - radius, center + radius, center + radius],
                 outline=(0, 242, 254, 255), width=int(14 * scale))

    # 2. Dynamic High-Speed Energy Chevrons / Vortex Ring
    # Outer speed notches
    for angle_deg in range(0, 360, 45):
        rad = math.radians(angle_deg)
        x1 = center + (radius - 28 * scale) * math.cos(rad)
        y1 = center + (radius - 28 * scale) * math.sin(rad)
        x2 = center + (radius - 8 * scale) * math.cos(rad)
        y2 = center + (radius - 8 * scale) * math.sin(rad)
        draw.line([(x1, y1), (x2, y2)], fill=(255, 255, 255, 200), width=int(6 * scale))

    # 3. Super-Bold White Downward Turbo Download Arrow
    # Arrow Stem (Width = 52px, Height = 100px)
    stem_w = 44 * scale
    stem_top = center - 110 * scale
    stem_bottom = center + 10 * scale
    draw.rectangle([center - stem_w, stem_top, center + stem_w, stem_bottom], fill=(255, 255, 255, 255))

    # Arrow Head Triangle (Pointing Down)
    head_w = 115 * scale
    head_top = center + 5 * scale
    head_tip = center + 120 * scale
    head_points = [
        (center - head_w, head_top),
        (center + head_w, head_top),
        (center, head_tip)
    ]
    draw.polygon(head_points, fill=(255, 255, 255, 255))

    # Arrow Head Inner Contrast Accent (Electric Cyan Core)
    inner_head_w = 70 * scale
    inner_head_top = center + 15 * scale
    inner_head_tip = center + 90 * scale
    draw.polygon([
        (center - inner_head_w, inner_head_top),
        (center + inner_head_w, inner_head_top),
        (center, inner_head_tip)
    ], fill=(0, 242, 254, 255))

    # Arrow Stem Inner Cyan Accent
    inner_stem_w = 20 * scale
    draw.rectangle([center - inner_stem_w, stem_top + 12 * scale, center + inner_stem_w, stem_bottom], fill=(0, 242, 254, 255))

    # 4. Receiving Speed Arc / Base Tray
    base_r = radius * 0.72
    base_box = [center - base_r, center - base_r, center + base_r, center + base_r]
    draw.arc(base_box, start=45, end=135, fill=(255, 255, 255, 255), width=int(16 * scale))

    # Downsample with Lanczos for ultra-crisp antialiased edges
    final = img.resize((size, size), Image.Resampling.LANCZOS)
    return final

if __name__ == "__main__":
    icon_512 = create_crisp_vortex_icon(512)
    icon_256 = icon_512.resize((256, 256), Image.Resampling.LANCZOS)
    icon_192 = icon_512.resize((192, 192), Image.Resampling.LANCZOS)
    icon_48  = icon_512.resize((48, 48), Image.Resampling.LANCZOS)
    icon_32  = icon_512.resize((32, 32), Image.Resampling.LANCZOS)
    icon_16  = icon_512.resize((16, 16), Image.Resampling.LANCZOS)

    # Save PNGs
    icon_512.save("ui/favicon-512.png", format="PNG")
    icon_192.save("ui/favicon-192.png", format="PNG")
    icon_256.save("ui/favicon.png", format="PNG")
    icon_256.save("winres/icon.png", format="PNG")
    icon_16.save("winres/icon16.png", format="PNG")

    # Multi-resolution Windows ICO
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    icon_512.save("app.ico", format="ICO", sizes=ico_sizes)
    icon_512.save("ui/favicon.ico", format="ICO", sizes=ico_sizes)
    print("Sharp icons generated successfully!")
