import math
from PIL import Image, ImageDraw, ImageFilter

def create_vortex_icon(size=512):
    # High-resolution canvas for supersampling
    scale = 2
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Base rounded rectangle
    margin = 20 * scale
    radius = 110 * scale
    rect_box = [margin, margin, canvas_size - margin, canvas_size - margin]
    
    # Outer dark shield background
    draw.rounded_rectangle(rect_box, radius=radius, fill=(8, 12, 20, 255), outline=(0, 242, 254, 180), width=4*scale)

    # Subtle inner dark gradient / glow ring
    center = canvas_size / 2
    for r in range(int(180 * scale), int(220 * scale), 2 * scale):
        alpha = int(40 * (1 - (r - 180 * scale) / (40 * scale)))
        draw.ellipse([center - r, center - r, center + r, center + r], outline=(0, 242, 254, alpha), width=2*scale)

    # 2. Draw Turbo Vortex Spiral Arms (Cyan to Electric Blue)
    # Outer swirling arc
    arc_box_1 = [center - 160*scale, center - 160*scale, center + 160*scale, center + 160*scale]
    draw.arc(arc_box_1, start=30, end=300, fill=(0, 242, 254, 255), width=int(18*scale))
    
    # Middle swirling arc
    arc_box_2 = [center - 120*scale, center - 120*scale, center + 120*scale, center + 120*scale]
    draw.arc(arc_box_2, start=120, end=380, fill=(59, 130, 246, 255), width=int(16*scale))

    # Inner swirling arc
    arc_box_3 = [center - 80*scale, center - 80*scale, center + 80*scale, center + 80*scale]
    draw.arc(arc_box_3, start=220, end=480, fill=(0, 242, 254, 255), width=int(14*scale))

    # 3. Dynamic Center Download Turbo Arrow
    # Arrow shaft
    arrow_w = 16 * scale
    arrow_top = center - 65 * scale
    arrow_bottom = center + 25 * scale
    draw.rounded_rectangle([center - arrow_w, arrow_top, center + arrow_w, arrow_bottom], radius=4*scale, fill=(255, 255, 255, 255))

    # Arrow head (pointing down)
    head_points = [
        (center - 46 * scale, arrow_bottom - 5 * scale),
        (center + 46 * scale, arrow_bottom - 5 * scale),
        (center, center + 65 * scale)
    ]
    draw.polygon(head_points, fill=(255, 255, 255, 255))

    # Base tray / cradle for the download arrow
    tray_w = 58 * scale
    tray_y = center + 85 * scale
    tray_h = 10 * scale
    draw.rounded_rectangle([center - tray_w, tray_y, center + tray_w, tray_y + tray_h], radius=4*scale, fill=(0, 242, 254, 255))
    draw.line([(center - tray_w, tray_y - 18*scale), (center - tray_w, tray_y + tray_h)], fill=(0, 242, 254, 255), width=int(8*scale))
    draw.line([(center + tray_w, tray_y - 18*scale), (center + tray_w, tray_y + tray_h)], fill=(0, 242, 254, 255), width=int(8*scale))

    # Downsample using Lanczos for crisp antialiasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

if __name__ == "__main__":
    icon_512 = create_vortex_icon(512)
    icon_192 = icon_512.resize((192, 192), Image.Resampling.LANCZOS)
    icon_256 = icon_512.resize((256, 256), Image.Resampling.LANCZOS)

    # Save PNGs
    icon_512.save("ui/favicon-512.png", format="PNG")
    icon_192.save("ui/favicon-192.png", format="PNG")
    icon_256.save("ui/favicon.png", format="PNG")

    # Generate multi-res Windows ICO
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    icon_512.save("app.ico", format="ICO", sizes=ico_sizes)
    icon_512.save("ui/favicon.ico", format="ICO", sizes=ico_sizes)
    print("Successfully generated all VortexDM high-resolution icons!")
