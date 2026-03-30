import json
import re

FLOOR_MAP = {
    "ground": "GF", "1st": "FF", "first": "FF", "2nd": "SF", "second": "SF",
    "3rd": "TF", "third": "TF", "4th": "4F", "fourth": "4F"
}

def get_floor_abbr(floor_str):
    if not floor_str: return ""
    f = str(floor_str).lower()
    for key, val in FLOOR_MAP.items():
        if key in f: return val
    return ""

FILE_PATH = r"c:\Users\kinge\CampusMap\CampusOS\data\buildings.json"
with open(FILE_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# ── Add missing rooms/floors mentioned by user ───────────────────────────────
# NLB FF, NLB SF
for b in data:
    if b["id"] == 23: # NLB
        existing_floors = [str(r.get("floor","")).lower() for r in b.get("rooms", [])]
        if "first" not in existing_floors and "1st" not in existing_floors:
            if "rooms" not in b: b["rooms"] = []
            b["rooms"].append({"number": "First Floor", "floor": "1st", "description": "Academic and lecture area"})
        if "second" not in existing_floors and "2nd" not in existing_floors:
            if "rooms" not in b: b["rooms"] = []
            b["rooms"].append({"number": "Second Floor", "floor": "2nd", "description": "Academic and lecture area"})
    
    if b["id"] == 22: # NFB
        # NFB FF, SF already exist (LT3 is 1st, Seminar 1 is 2nd)
        pass

# ── Transform all ────────────────────────────────────────────────────────────
for building in data:
    sn = building.get("shortName", building["name"])
    
    # Process Rooms
    if "rooms" in building:
        for room in building["rooms"]:
            num = room.get("number", "").strip()
            # Clean number: strip prefixes but keep the core part
            # e.g. "Lecture Room 025" -> "025" and "25"
            core_num = re.sub(r'^(room|lecture room|lab|computer lab|seminar|lt|hall)\s*', '', num, flags=re.IGNORECASE)
            
            floor_abbr = get_floor_abbr(room.get("floor", ""))
            
            if "keywords" not in room: room["keywords"] = []
            
            # Pattern variations
            vars = [
                f"{sn} ROOM {core_num}", 
                f"{sn} {core_num}",
                f"{sn} {num}"
            ]
            if floor_abbr:
                vars.append(f"{sn} {floor_abbr}")
            
            # Map core_num with leading zero too
            if core_num.isdigit():
                vars.append(f"{sn} ROOM {int(core_num)}")
                vars.append(f"{sn} {int(core_num)}")
            
            for v in vars:
                uv = v.upper()
                if uv not in room["keywords"]: room["keywords"].append(uv)
            
            room["keywords"] = list(set(room["keywords"]))

    # Process Services
    if "services" in building:
        for svc in building["services"]:
            floor_abbr = get_floor_abbr(svc.get("floor", ""))
            if "keywords" not in svc: svc["keywords"] = []
            
            if floor_abbr:
                k_floor = f"{sn} {floor_abbr}".upper()
                if k_floor not in svc["keywords"]: svc["keywords"].append(k_floor)
            
            svc["keywords"].append(f"{sn} {svc['name']}".upper())
            svc["keywords"] = list(set(svc["keywords"]))

with open(FILE_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("✅ buildings.json fully optimized for student search patterns.")
