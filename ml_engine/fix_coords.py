import json
import random

state_coords = {
    'Andhra Pradesh': (15.91, 79.74),
    'Arunachal Pradesh': (28.21, 94.72),
    'Assam': (26.20, 92.93),
    'Bihar': (25.09, 85.31),
    'Chhattisgarh': (21.27, 81.86),
    'Goa': (15.29, 74.12),
    'Gujarat': (22.25, 71.19),
    'Haryana': (29.05, 76.08),
    'Himachal Pradesh': (31.10, 77.17),
    'Jharkhand': (23.61, 85.27),
    'Karnataka': (15.31, 75.71),
    'Kerala': (10.85, 76.27),
    'Madhya Pradesh': (22.97, 78.65),
    'Maharashtra': (19.75, 75.71),
    'Manipur': (24.66, 93.90),
    'Meghalaya': (25.46, 91.36),
    'Mizoram': (23.16, 92.93),
    'Nagaland': (26.15, 94.56),
    'Odisha': (20.95, 85.09),
    'Punjab': (31.14, 75.34),
    'Rajasthan': (27.02, 74.21),
    'Sikkim': (27.53, 88.51),
    'Tamil Nadu': (11.12, 78.65),
    'Telangana': (18.11, 79.01),
    'Tripura': (23.94, 91.98),
    'Uttar Pradesh': (26.84, 80.94),
    'Uttarakhand': (30.06, 79.01),
    'West Bengal': (22.98, 87.85),
    'Andaman and Nicobar Islands': (11.74, 92.65),
    'Chandigarh': (30.73, 76.77),
    'Dadra and Nagar Haveli and Daman and Diu': (20.18, 73.01),
    'Delhi': (28.70, 77.10),
    'Jammu and Kashmir': (33.77, 76.57),
    'Ladakh': (34.15, 77.57),
    'Lakshadweep': (10.56, 72.64),
    'Puducherry': (11.94, 79.80)
}

with open('projects.json', 'r') as f:
    projects = json.load(f)

for p in projects:
    base_lat, base_lng = state_coords[p['state']]
    # add noise between -1.5 and 1.5 degrees so they spread across the state
    p['latitude'] = round(base_lat + random.uniform(-1.5, 1.5), 4)
    p['longitude'] = round(base_lng + random.uniform(-1.5, 1.5), 4)

with open('projects.json', 'w') as f:
    json.dump(projects, f, indent=2)

print('Fixed coordinates to be on land!')
