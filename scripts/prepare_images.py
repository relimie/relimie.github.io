import os
import re
from PIL import Image, ImageOps

def natural_sort_key(s):
    """Sort strings containing numbers in a way humans expect."""
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s)]

def process_section(section_dir):
    print(f"Processing {section_dir}...")
    files = [f for f in os.listdir(section_dir) if os.path.isfile(os.path.join(section_dir, f))]
    
    bg_file = next((f for f in files if f.lower().startswith("background.")), None)
    if not bg_file:
        print(f"  [SKIP] No background found.")
        return

    bg_path = os.path.join(section_dir, bg_file)
    bg_img = Image.open(bg_path).convert("RGBA")

    # 1. Map existing screen indices and collect new ones
    sources = {} # idx -> path
    unassigned = []
    
    for f in files:
        if f.lower() == bg_file.lower(): continue
        if not f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")): continue
        
        # Match screenN-org.webp or screenN.webp
        match = re.match(r'^screen(\d+)(?:-org)?\.webp$', f, re.I)
        if match:
            idx = int(match.group(1))
            # Prefer -org version if both exist
            if idx not in sources or f.endswith("-org.webp"):
                sources[idx] = os.path.join(section_dir, f)
        else:
            unassigned.append(os.path.join(section_dir, f))

    unassigned.sort(key=natural_sort_key)
    
    # Create final sequence plan
    sorted_indices = sorted(sources.keys())
    next_idx = (max(sorted_indices) + 1) if sorted_indices else 1
    
    final_plan = []
    for idx in sorted_indices:
        final_plan.append((idx, sources[idx]))
    for path in unassigned:
        final_plan.append((next_idx, path))
        next_idx += 1

    # 2. LOAD ALL IMAGES INTO MEMORY (Crucial to avoid overwriting source)
    loaded_data = []
    for idx, path in final_plan:
        try:
            with Image.open(path) as img:
                loaded_data.append((idx, img.copy()))
        except Exception as e:
            print(f"  [ERROR] Failed to read {path}: {e}")

    processed_abs_paths = [os.path.abspath(bg_path)]

    # 3. PROCESS AND WRITE
    for idx, img in loaded_data:
        target_org_name = f"screen{idx}-org.webp"
        target_final_name = f"screen{idx}.webp"
        target_org_path = os.path.join(section_dir, target_org_name)
        target_final_path = os.path.join(section_dir, target_final_name)
        
        print(f"  -> screen{idx}")
        
        img = img.convert("RGBA")
        w, h = img.size
        radius = int(w * 0.10) # 10% radius
        
        mask = Image.new("L", (w, h), 0)
        from PIL import ImageDraw
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
        
        rounded_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        rounded_img.paste(img, (0, 0), mask)
        
        new_w, new_h = int(w * 1.1), int(h * 1.1)
        canvas_bg = ImageOps.fit(bg_img, (new_w, new_h), centering=(0.5, 0.5))
        
        final_img = Image.new("RGBA", (new_w, new_h))
        final_img.paste(canvas_bg, (0, 0))
        final_img.paste(rounded_img, ((new_w - w) // 2, (new_h - h) // 2), rounded_img)
        
        img.save(target_org_path, "WEBP", quality=90)
        final_img.convert("RGB").save(target_final_path, "WEBP", quality=85)
        
        processed_abs_paths.append(os.path.abspath(target_org_path))
        processed_abs_paths.append(os.path.abspath(target_final_path))

    # 4. CLEANUP
    for f in os.listdir(section_dir):
        f_path = os.path.abspath(os.path.join(section_dir, f))
        if f_path not in processed_abs_paths:
            if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                os.remove(f_path)

def main():
    # Use absolute path for safety
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    base_dir = os.path.join(project_root, "assets", "images")
    
    if not os.path.exists(base_dir):
        print(f"Error: Directory {base_dir} not found.")
        return
        
    sections = [d for d in os.listdir(base_dir) if d.startswith("section") and os.path.isdir(os.path.join(base_dir, d))]
    sections.sort(key=natural_sort_key)
    
    for section in sections:
        process_section(os.path.join(base_dir, section))
    
    print("\nDone! All sections processed.")

if __name__ == "__main__":
    main()
