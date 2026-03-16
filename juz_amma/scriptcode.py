import os
import urllib.request
 
# Create the folder
folder_name = "جزء عم"
os.makedirs(folder_name, exist_ok=True)
 
base_url = "https://server10.mp3quran.net/minsh/"
 
for i in range(78, 115):  # 78 to 114 inclusive
    filename = f"{i:03d}.mp3"
    url = f"{base_url}{filename}"
    filepath = os.path.join(folder_name, filename)
 
    if os.path.exists(filepath):
        print(f"Already exists: {filename}, skipping.")
        continue
 
    print(f"Downloading: {url} ...")
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"  Saved: {filepath}")
    except Exception as e:
        print(f"  Error downloading {filename}: {e}")
 
print("\nDone! All files saved to:", folder_name)