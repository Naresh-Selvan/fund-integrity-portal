import json
import random

states_districts = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
    'Arunachal Pradesh': ['Tawang', 'Itanagar', 'Ziro'],
    'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
    'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
    'Kerala': ['Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane'],
    'Manipur': ['Imphal', 'Churachandpur'],
    'Meghalaya': ['Shillong', 'Tura', 'Cherrapunji'],
    'Mizoram': ['Aizawl', 'Lunglei'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    'Sikkim': ['Gangtok', 'Namchi', 'Mangan'],
    'Tamil Nadu': ['Chennai', 'Madurai', 'Coimbatore', 'Salem'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital'],
    'West Bengal': ['Kolkata', 'Darjeeling', 'Howrah', 'Siliguri'],
    'Andaman and Nicobar Islands': ['Port Blair'],
    'Chandigarh': ['Chandigarh'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag'],
    'Ladakh': ['Leh', 'Kargil'],
    'Lakshadweep': ['Kavaratti'],
    'Puducherry': ['Puducherry', 'Auroville']
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

for i in range(1, 5001):
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
    
    if i % 10 == 0:
        spent = int(budget * random.uniform(1.1, 1.5))
        status = 'Active'
    
    if i % 7 == 0:
        contractor = 'Surya Infra'
        state = 'Maharashtra'
        district = 'Mumbai'
    
    projects.append({
        'id': f'PRJ-2023-{str(i).zfill(4)}',
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

with open('projects.json', 'w') as f:
    json.dump(projects, f, indent=2)

print('Generated 5000 projects across ALL India!')
