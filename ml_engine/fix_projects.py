import json

with open('../src/data/mockProjects.ts', 'r') as f:
    content = f.read()

# Replace interface
content = content.replace('latitude?: number;\n  longitude?: number;', 'riskScore?: number;\n  coordinates?: [number, number];')

# We need to change the loop to add coordinates instead of lat/long.
# Actually we can just keep lat/long in the interface and compute riskScore at the bottom.

content = content.replace('export interface Project {', 'import { computeRisk, type RiskFactor } from \'../lib/riskEngine\';\n\nexport interface Project {')
content = content.replace('latitude?: number;\n  longitude?: number;', 'latitude?: number;\n  longitude?: number;\n  coordinates?: [number, number];\n  riskScore?: number;')

append_str = '''\n\nexport const riskFactorsById: Record<string, RiskFactor[]> = {};\n\nfor (const project of mockProjects) {\n  const { score, factors } = computeRisk(project, mockProjects);\n  project.riskScore = score;\n  if (project.latitude && project.longitude) {\n    project.coordinates = [project.latitude, project.longitude];\n  }\n  riskFactorsById[project.id] = factors;\n}\n'''

content += append_str

with open('../src/data/mockProjects.ts', 'w') as f:
    f.write(content)

