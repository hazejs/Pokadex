from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
import db

import time

app = Flask(__name__)
CORS(app)

# In-memory store for captured pokemon
captured_pokemon = set()
_cached_db = None
_last_cache_time = 0
CACHE_TTL = 60 # Refresh data every 60 seconds

def get_cached_data():
    global _cached_db, _last_cache_time
    current_time = time.time()
    if _cached_db is None or (current_time - _last_cache_time) > CACHE_TTL:
        _cached_db = db.get()
        _last_cache_time = current_time
    return _cached_db

@app.route('/icon/<name>')
def get_icon_url(name:str):
    return redirect(f"https://img.pokemondb.net/sprites/silver/normal/{name.lower()}.png")

@app.route('/pokemon')
def get_pokemon():
    data = get_cached_data()
    
    # Query parameters
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=20, type=int)
    sort_by = request.args.get('sortBy', default='number')
    order = request.args.get('order', default='asc')
    p_type = request.args.get('type', default=None)
    search = request.args.get('search', default=None)
    captured_filter = request.args.get('captured', default=None)

    # 1. Add 'captured' status to each pokemon
    for p in data:
        p['captured'] = p['name'] in captured_pokemon

    # 2. Filtering by type
    if p_type:
        data = [p for p in data if p_type.lower() in [p['type_one'].lower(), (p['type_two'] or '').lower()]]

    # 3. Filtering by captured status
    if captured_filter is not None:
        is_captured = captured_filter.lower() == 'true'
        data = [p for p in data if p['captured'] == is_captured]

    # 4. Fuzzy search (Bonus)
    if search:
        search = search.lower()
        # Optimize by only searching string fields and stats
        search_fields = ['name', 'type_one', 'type_two']
        stat_fields = ['hit_points', 'attack', 'defense', 'special_attack', 'special_defense', 'speed', 'number']
        
        data = [p for p in data if (
            any(search in str(p.get(f, '')).lower() for f in search_fields) or
            any(search == str(p.get(f, '')) for f in stat_fields)
        )]

    # 4. Sorting
    reverse = (order.lower() == 'desc')
    try:
        data.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)
    except Exception:
        data.sort(key=lambda x: x.get('number', 0), reverse=reverse)

    # 5. Pagination
    total_count = len(data)
    start = (page - 1) * limit
    end = start + limit
    paginated_data = data[start:end]

    return jsonify({
        'pokemon': paginated_data,
        'total': total_count,
        'page': page,
        'limit': limit
    })

@app.route('/pokemon/<name>/toggle-capture', methods=['POST'])
def toggle_capture(name):
    if name in captured_pokemon:
        captured_pokemon.remove(name)
        status = False
    else:
        captured_pokemon.add(name)
        status = True
    return jsonify({'name': name, 'captured': status})

@app.route('/types')
def get_types():
    data = get_cached_data()
    types = set()
    for p in data:
        if p.get('type_one'): types.add(p['type_one'])
        if p.get('type_two'): types.add(p['type_two'])
    return jsonify(sorted(list(types)))

if __name__=='__main__':
    app.run(port=8080, debug=True)
