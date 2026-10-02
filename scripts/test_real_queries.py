import urllib.request
import json

queries = [
    'Take me to USTED Library',
    'Where is the Clinic?',
    'Find Dr. Kotor Asare office',
    'Where can I eat around Atwima Hall?'
]

for q in queries:
    req = urllib.request.Request(
        'http://127.0.0.1:8000/parse',
        data=json.dumps({'query': q}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print(f"Student Query: '{q}'")
        print(f"  -> Extracted Action: {res.get('action')}")
        print(f"  -> Extracted Params: {res.get('parameters')}\n")
