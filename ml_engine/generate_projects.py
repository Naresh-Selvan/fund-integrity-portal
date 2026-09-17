import json
import random

states_districts = {
    'Maharashtra': ['Mumbai Suburban', 'Pune', 'Nagpur', 'Thane'],
    'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Kanpur', 'Agra'],
    'Tamil Nadu': ['Chennai', 'Madurai', 'Coimbatore', 'Salem'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
    'Kerala': ['Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore']
}

templates = [
    'Construction of CC Road in {dist}',
    'Installation of Solar High Mast Lights in Ward {rand_num}',
    'Provision of RO Water Plant at {dist} Govt Hospital',
    'Construction of Additional Classrooms in ZP School, {dist}',
    'Purchase of {rand_num} Ambulances for PHC, {dist}',
    'Construction of Community Hall in {dist}',
    'Upgradation of Public Library in {dist}',
    'Installation of Open Gym Equipment in {dist} Park'
]

contractors = ['Surya Infra', 'KV Constructions', 'Reddy & Sons', 'Singh Builders', 'L&T Local', 'Apex Contractors', 'National Builders', 'TechVision Suppliers']

projects = []

for i in range(1, 101):
    state = random.choice(list(states_districts.keys()))
    district = random.choice(states_districts[state])
    template = random.choice(templates)
    name = template.format(dist=district, rand_num=random.randint(2, 50))
    
    budget = random.choice([500000, 1000000, 2000000, 3500000, 5000000, 8000000, 12000000, 15000000])
    status = random.choice(['Active', 'Active', 'Active', 'Delayed', 'Completed', 'Flagged', 'Registered'])
    
    if status == 'Completed':
        spent = budget
    elif status == 'Registered':
        spent = 0
    else:
        spent = int(budget * random.uniform(0.1, 0.95))
        
    contractor = random.choice(contractors)
    
    # Intentionally inject anomalies (e.g., spent > budget)
    if i % 10 == 0:
        spent = int(budget * random.uniform(1.1, 1.5))
        status = 'Active'
    
    # Intentionally inject high vendor density (all to Surya Infra)
    if i % 7 == 0:
        contractor = 'Surya Infra'
        state = 'Maharashtra'
    
    projects.append({
        'id': f'PRJ-2023-{str(i).zfill(3)}',
        'name': name,
        'scheme': 'MPLADS',
        'budget': budget,
        'spent': spent,
        'startDate': '2023-05-10',
        'endDate': '2024-05-10',
        'status': status,
        'district': district,
        'state': state,
        'contractor': contractor,
        'latitude': round(random.uniform(8.0, 30.0), 4),
        'longitude': round(random.uniform(70.0, 90.0), 4)
    })

# Write to TS
ts_content = f"""export type ProjectStatus = 'Active' | 'Delayed' | 'Completed' | 'Flagged' | 'Registered';

export interface Project {{
  id: string;
  name: string;
  scheme: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  district: string;
  state: string;
  contractor: string;
  latitude?: number;
  longitude?: number;
}}

export const mockProjects: Project[] = {json.dumps(projects, indent=2)};
"""

with open('../src/data/mockProjects.ts', 'w') as f:
    f.write(ts_content)

# Write to JSON for ML
with open('projects.json', 'w') as f:
    json.dump(projects, f, indent=2)

# Write to Dart
dart_content = "import '../models/project.dart';\n\nfinal List<Project> mockProjects = [\n"
for p in projects:
    dart_content += f"""  Project(
    id: '{p['id']}',
    name: '{p['name']}',
    scheme: '{p['scheme']}',
    budget: {p['budget']},
    spent: {p['spent']},
    startDate: '{p['startDate']}',
    endDate: '{p['endDate']}',
    status: '{p['status']}',
    district: '{p['district']}',
    state: '{p['state']}',
    contractor: '{p['contractor']}',
  ),\n"""
dart_content += "];"

with open('D:/ai_fund_integrity/lib/data/mock_data.dart', 'w') as f:
    f.write(dart_content)

print('Generated 100 projects for React, ML, and Flutter!')
