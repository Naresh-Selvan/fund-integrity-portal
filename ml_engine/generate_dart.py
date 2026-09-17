import json

with open('projects.json', 'r') as f:
    projects = json.load(f)

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

print('Generated 5000 projects for Flutter!')
