import json

with open('projects.json', 'r') as f:
    projects = json.load(f)

# Update projects to have coordinates and riskScore
for p in projects:
    p['coordinates'] = [p['latitude'], p['longitude']]
    p['riskScore'] = 0
    # The TS interface expects 'status' to be a literal string type, we already have that.

ts_content = f"""import {{ computeRisk, type RiskFactor }} from '../lib/riskEngine';

export type ProjectStatus = 'Active' | 'Delayed' | 'Completed' | 'Flagged' | 'Registered';

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
  coordinates: [number, number];
  riskScore: number;
}}

export const mockProjects: Project[] = {json.dumps(projects, indent=2)};

export const riskFactorsById: Record<string, RiskFactor[]> = {{}};

for (const project of mockProjects) {{
  const {{ score, factors }} = computeRisk(project, mockProjects);
  project.riskScore = score;
  riskFactorsById[project.id] = factors;
}}
"""

with open('../src/data/mockProjects.ts', 'w') as f:
    f.write(ts_content)

print("Fixed TS File!")
