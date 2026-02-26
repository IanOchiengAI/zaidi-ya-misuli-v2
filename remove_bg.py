from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=220):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # item is (R, G, B, A)
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            # Change all white (also shades of white)
            # to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "WEBP")
    print("Successfully created transparent logo")

if __name__ == "__main__":
    remove_white_bg("rose-logo.png", "rose-logo-transparent.webp")
