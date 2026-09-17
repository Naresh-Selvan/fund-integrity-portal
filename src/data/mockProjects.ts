import { computeRisk, type RiskFactor } from '../lib/riskEngine';

export type ProjectStatus = 'Active' | 'Delayed' | 'Completed' | 'Flagged' | 'Registered';

export interface Project {
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
}

export const mockProjects: Project[] = [
  {
    "id": "PRJ-2023-001",
    "name": "Construction of Additional Classrooms in ZP School, Thrissur",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 1351982,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Thrissur",
    "state": "Kerala",
    "contractor": "TechVision Suppliers",
    "latitude": 12.1213,
    "longitude": 87.7341,
    "coordinates": [
      12.1213,
      87.7341
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-002",
    "name": "Construction of Community Hall in Hubballi",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 4364149,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Hubballi",
    "state": "Karnataka",
    "contractor": "TechVision Suppliers",
    "latitude": 13.6328,
    "longitude": 71.0674,
    "coordinates": [
      13.6328,
      71.0674
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-003",
    "name": "Construction of Additional Classrooms in ZP School, Jalandhar",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 2120623,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Jalandhar",
    "state": "Punjab",
    "contractor": "Singh Builders",
    "latitude": 19.9435,
    "longitude": 85.1099,
    "coordinates": [
      19.9435,
      85.1099
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-004",
    "name": "Construction of CC Road in Patiala",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Patiala",
    "state": "Punjab",
    "contractor": "Surya Infra",
    "latitude": 12.4942,
    "longitude": 73.7367,
    "coordinates": [
      12.4942,
      73.7367
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-005",
    "name": "Purchase of 19 Ambulances for PHC, Rajkot",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 3890698,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Rajkot",
    "state": "Gujarat",
    "contractor": "L&T Local",
    "latitude": 11.1787,
    "longitude": 70.9148,
    "coordinates": [
      11.1787,
      70.9148
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-006",
    "name": "Installation of Open Gym Equipment in Varanasi Park",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 2194312,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Varanasi",
    "state": "Uttar Pradesh",
    "contractor": "KV Constructions",
    "latitude": 13.1263,
    "longitude": 81.0245,
    "coordinates": [
      13.1263,
      81.0245
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-007",
    "name": "Installation of Solar High Mast Lights in Ward 23",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 10877388,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Ahmedabad",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 13.5788,
    "longitude": 72.5985,
    "coordinates": [
      13.5788,
      72.5985
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-008",
    "name": "Construction of Community Hall in Agra",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 387251,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Agra",
    "state": "Uttar Pradesh",
    "contractor": "KV Constructions",
    "latitude": 29.4523,
    "longitude": 86.6148,
    "coordinates": [
      29.4523,
      86.6148
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-009",
    "name": "Construction of Additional Classrooms in ZP School, Thrissur",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Thrissur",
    "state": "Kerala",
    "contractor": "National Builders",
    "latitude": 8.3524,
    "longitude": 71.8184,
    "coordinates": [
      8.3524,
      71.8184
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-010",
    "name": "Provision of RO Water Plant at Guntur Govt Hospital",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 1109415,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Guntur",
    "state": "Andhra Pradesh",
    "contractor": "National Builders",
    "latitude": 24.5535,
    "longitude": 88.0218,
    "coordinates": [
      24.5535,
      88.0218
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-011",
    "name": "Provision of RO Water Plant at Amritsar Govt Hospital",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 11068556,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Amritsar",
    "state": "Punjab",
    "contractor": "Singh Builders",
    "latitude": 25.6527,
    "longitude": 80.0378,
    "coordinates": [
      25.6527,
      80.0378
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-012",
    "name": "Upgradation of Public Library in Kozhikode",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 15000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Kozhikode",
    "state": "Kerala",
    "contractor": "Surya Infra",
    "latitude": 18.4331,
    "longitude": 70.1999,
    "coordinates": [
      18.4331,
      70.1999
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-013",
    "name": "Installation of Solar High Mast Lights in Ward 4",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 430187,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Thiruvananthapuram",
    "state": "Kerala",
    "contractor": "Reddy & Sons",
    "latitude": 22.499,
    "longitude": 89.8511,
    "coordinates": [
      22.499,
      89.8511
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-014",
    "name": "Construction of CC Road in Mysuru",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 3460896,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Mysuru",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 23.4188,
    "longitude": 77.0611,
    "coordinates": [
      23.4188,
      77.0611
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-015",
    "name": "Purchase of 45 Ambulances for PHC, Lucknow",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 291493,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "contractor": "Reddy & Sons",
    "latitude": 11.3234,
    "longitude": 84.5426,
    "coordinates": [
      11.3234,
      84.5426
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-016",
    "name": "Installation of Open Gym Equipment in Bengaluru Park",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 605806,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Bengaluru",
    "state": "Karnataka",
    "contractor": "Reddy & Sons",
    "latitude": 8.6219,
    "longitude": 85.1243,
    "coordinates": [
      8.6219,
      85.1243
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-017",
    "name": "Construction of CC Road in Thane",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 3784639,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Thane",
    "state": "Maharashtra",
    "contractor": "National Builders",
    "latitude": 23.1893,
    "longitude": 70.8636,
    "coordinates": [
      23.1893,
      70.8636
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-018",
    "name": "Construction of CC Road in Nellore",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 4402695,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Nellore",
    "state": "Andhra Pradesh",
    "contractor": "L&T Local",
    "latitude": 27.5864,
    "longitude": 87.6431,
    "coordinates": [
      27.5864,
      87.6431
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-019",
    "name": "Construction of Community Hall in Guntur",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Guntur",
    "state": "Andhra Pradesh",
    "contractor": "L&T Local",
    "latitude": 21.2117,
    "longitude": 77.7827,
    "coordinates": [
      21.2117,
      77.7827
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-020",
    "name": "Provision of RO Water Plant at Pune Govt Hospital",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 22200489,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Pune",
    "state": "Maharashtra",
    "contractor": "TechVision Suppliers",
    "latitude": 19.935,
    "longitude": 79.8441,
    "coordinates": [
      19.935,
      79.8441
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-021",
    "name": "Installation of Open Gym Equipment in Ludhiana Park",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 4971541,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Flagged",
    "district": "Ludhiana",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 13.9056,
    "longitude": 72.1341,
    "coordinates": [
      13.9056,
      72.1341
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-022",
    "name": "Provision of RO Water Plant at Mumbai Suburban Govt Hospital",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 3500000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "contractor": "L&T Local",
    "latitude": 28.1302,
    "longitude": 81.0113,
    "coordinates": [
      28.1302,
      81.0113
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-023",
    "name": "Installation of Solar High Mast Lights in Ward 39",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Ernakulam",
    "state": "Kerala",
    "contractor": "Apex Contractors",
    "latitude": 26.0122,
    "longitude": 88.7848,
    "coordinates": [
      26.0122,
      88.7848
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-024",
    "name": "Construction of Community Hall in Mysuru",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Mysuru",
    "state": "Karnataka",
    "contractor": "Singh Builders",
    "latitude": 26.0519,
    "longitude": 73.051,
    "coordinates": [
      26.0519,
      73.051
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-025",
    "name": "Installation of Open Gym Equipment in Hubballi Park",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 500000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Hubballi",
    "state": "Karnataka",
    "contractor": "Singh Builders",
    "latitude": 17.5572,
    "longitude": 75.9232,
    "coordinates": [
      17.5572,
      75.9232
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-026",
    "name": "Construction of Additional Classrooms in ZP School, Thrissur",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 3500000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Thrissur",
    "state": "Kerala",
    "contractor": "National Builders",
    "latitude": 18.9759,
    "longitude": 88.3571,
    "coordinates": [
      18.9759,
      88.3571
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-027",
    "name": "Purchase of 6 Ambulances for PHC, Patiala",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 7831156,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Patiala",
    "state": "Punjab",
    "contractor": "Surya Infra",
    "latitude": 18.7728,
    "longitude": 71.7849,
    "coordinates": [
      18.7728,
      71.7849
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-028",
    "name": "Provision of RO Water Plant at Ernakulam Govt Hospital",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 581570,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Ernakulam",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 12.9159,
    "longitude": 81.1208,
    "coordinates": [
      12.9159,
      81.1208
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-029",
    "name": "Construction of Additional Classrooms in ZP School, Salem",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 469229,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Salem",
    "state": "Tamil Nadu",
    "contractor": "Reddy & Sons",
    "latitude": 18.7883,
    "longitude": 73.9368,
    "coordinates": [
      18.7883,
      73.9368
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-030",
    "name": "Construction of CC Road in Ludhiana",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 1321353,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Ludhiana",
    "state": "Punjab",
    "contractor": "TechVision Suppliers",
    "latitude": 8.8933,
    "longitude": 80.4168,
    "coordinates": [
      8.8933,
      80.4168
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-031",
    "name": "Construction of Additional Classrooms in ZP School, Madurai",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 2423700,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "contractor": "Apex Contractors",
    "latitude": 8.9668,
    "longitude": 79.8353,
    "coordinates": [
      8.9668,
      79.8353
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-032",
    "name": "Construction of Additional Classrooms in ZP School, Coimbatore",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 2216719,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Coimbatore",
    "state": "Tamil Nadu",
    "contractor": "Reddy & Sons",
    "latitude": 27.1663,
    "longitude": 78.1301,
    "coordinates": [
      27.1663,
      78.1301
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-033",
    "name": "Installation of Open Gym Equipment in Ernakulam Park",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 1073712,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Ernakulam",
    "state": "Kerala",
    "contractor": "Singh Builders",
    "latitude": 12.187,
    "longitude": 89.2457,
    "coordinates": [
      12.187,
      89.2457
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-034",
    "name": "Construction of Community Hall in Thane",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 823442,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Thane",
    "state": "Maharashtra",
    "contractor": "KV Constructions",
    "latitude": 21.1474,
    "longitude": 85.3363,
    "coordinates": [
      21.1474,
      85.3363
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-035",
    "name": "Construction of CC Road in Coimbatore",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 15000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Coimbatore",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 12.5717,
    "longitude": 82.8893,
    "coordinates": [
      12.5717,
      82.8893
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-036",
    "name": "Installation of Open Gym Equipment in Coimbatore Park",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 749474,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Coimbatore",
    "state": "Tamil Nadu",
    "contractor": "Reddy & Sons",
    "latitude": 28.4764,
    "longitude": 78.341,
    "coordinates": [
      28.4764,
      78.341
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-037",
    "name": "Installation of Solar High Mast Lights in Ward 30",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 2000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Ahmedabad",
    "state": "Gujarat",
    "contractor": "Singh Builders",
    "latitude": 9.2912,
    "longitude": 78.8017,
    "coordinates": [
      9.2912,
      78.8017
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-038",
    "name": "Construction of Additional Classrooms in ZP School, Vijayawada",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Vijayawada",
    "state": "Andhra Pradesh",
    "contractor": "Singh Builders",
    "latitude": 12.3421,
    "longitude": 84.7895,
    "coordinates": [
      12.3421,
      84.7895
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-039",
    "name": "Construction of Additional Classrooms in ZP School, Lucknow",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 599670,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "contractor": "Surya Infra",
    "latitude": 16.3699,
    "longitude": 87.4071,
    "coordinates": [
      16.3699,
      87.4071
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-040",
    "name": "Construction of Additional Classrooms in ZP School, Patiala",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 1449532,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Patiala",
    "state": "Punjab",
    "contractor": "Singh Builders",
    "latitude": 22.201,
    "longitude": 88.3285,
    "coordinates": [
      22.201,
      88.3285
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-041",
    "name": "Construction of Community Hall in Thrissur",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 1182293,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Thrissur",
    "state": "Kerala",
    "contractor": "KV Constructions",
    "latitude": 10.311,
    "longitude": 73.9868,
    "coordinates": [
      10.311,
      73.9868
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-042",
    "name": "Upgradation of Public Library in Thane",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 3187654,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Thane",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 28.0723,
    "longitude": 77.8897,
    "coordinates": [
      28.0723,
      77.8897
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-043",
    "name": "Upgradation of Public Library in Salem",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 2187575,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Salem",
    "state": "Tamil Nadu",
    "contractor": "National Builders",
    "latitude": 29.5236,
    "longitude": 80.9563,
    "coordinates": [
      29.5236,
      80.9563
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-044",
    "name": "Provision of RO Water Plant at Rajkot Govt Hospital",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 2000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Rajkot",
    "state": "Gujarat",
    "contractor": "Reddy & Sons",
    "latitude": 18.451,
    "longitude": 79.5607,
    "coordinates": [
      18.451,
      79.5607
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-045",
    "name": "Installation of Solar High Mast Lights in Ward 11",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Varanasi",
    "state": "Uttar Pradesh",
    "contractor": "Reddy & Sons",
    "latitude": 14.5771,
    "longitude": 87.0706,
    "coordinates": [
      14.5771,
      87.0706
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-046",
    "name": "Installation of Open Gym Equipment in Mysuru Park",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 693624,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Mysuru",
    "state": "Karnataka",
    "contractor": "Surya Infra",
    "latitude": 29.8382,
    "longitude": 86.3666,
    "coordinates": [
      29.8382,
      86.3666
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-047",
    "name": "Provision of RO Water Plant at Nagpur Govt Hospital",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 7247181,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Nagpur",
    "state": "Maharashtra",
    "contractor": "Singh Builders",
    "latitude": 23.1752,
    "longitude": 74.8218,
    "coordinates": [
      23.1752,
      74.8218
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-048",
    "name": "Installation of Open Gym Equipment in Madurai Park",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 3500000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "contractor": "National Builders",
    "latitude": 24.8006,
    "longitude": 86.5897,
    "coordinates": [
      24.8006,
      86.5897
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-049",
    "name": "Installation of Solar High Mast Lights in Ward 12",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Agra",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 10.0142,
    "longitude": 79.2367,
    "coordinates": [
      10.0142,
      79.2367
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-050",
    "name": "Installation of Open Gym Equipment in Pune Park",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 728685,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Pune",
    "state": "Maharashtra",
    "contractor": "TechVision Suppliers",
    "latitude": 17.0529,
    "longitude": 73.3853,
    "coordinates": [
      17.0529,
      73.3853
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-051",
    "name": "Installation of Open Gym Equipment in Bengaluru Park",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 3500000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Bengaluru",
    "state": "Karnataka",
    "contractor": "Reddy & Sons",
    "latitude": 10.8718,
    "longitude": 81.7404,
    "coordinates": [
      10.8718,
      81.7404
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-052",
    "name": "Upgradation of Public Library in Thiruvananthapuram",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 3610212,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Flagged",
    "district": "Thiruvananthapuram",
    "state": "Kerala",
    "contractor": "Surya Infra",
    "latitude": 24.8555,
    "longitude": 78.4327,
    "coordinates": [
      24.8555,
      78.4327
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-053",
    "name": "Installation of Open Gym Equipment in Kanpur Park",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 658759,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Flagged",
    "district": "Kanpur",
    "state": "Uttar Pradesh",
    "contractor": "KV Constructions",
    "latitude": 16.7989,
    "longitude": 88.627,
    "coordinates": [
      16.7989,
      88.627
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-054",
    "name": "Construction of Additional Classrooms in ZP School, Salem",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Salem",
    "state": "Tamil Nadu",
    "contractor": "National Builders",
    "latitude": 16.9894,
    "longitude": 70.9993,
    "coordinates": [
      16.9894,
      70.9993
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-055",
    "name": "Construction of CC Road in Bengaluru",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 3783639,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Flagged",
    "district": "Bengaluru",
    "state": "Karnataka",
    "contractor": "Surya Infra",
    "latitude": 18.2756,
    "longitude": 88.1291,
    "coordinates": [
      18.2756,
      88.1291
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-056",
    "name": "Installation of Solar High Mast Lights in Ward 49",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 1359075,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Thrissur",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 8.6504,
    "longitude": 72.2367,
    "coordinates": [
      8.6504,
      72.2367
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-057",
    "name": "Construction of Community Hall in Ernakulam",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 2352765,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Ernakulam",
    "state": "Kerala",
    "contractor": "KV Constructions",
    "latitude": 8.8904,
    "longitude": 83.9101,
    "coordinates": [
      8.8904,
      83.9101
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-058",
    "name": "Construction of CC Road in Lucknow",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 12000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "contractor": "Apex Contractors",
    "latitude": 10.3193,
    "longitude": 81.4075,
    "coordinates": [
      10.3193,
      81.4075
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-059",
    "name": "Upgradation of Public Library in Surat",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 431421,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Surat",
    "state": "Gujarat",
    "contractor": "Surya Infra",
    "latitude": 29.1011,
    "longitude": 82.7231,
    "coordinates": [
      29.1011,
      82.7231
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-060",
    "name": "Purchase of 8 Ambulances for PHC, Amritsar",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 625211,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Amritsar",
    "state": "Punjab",
    "contractor": "TechVision Suppliers",
    "latitude": 23.4191,
    "longitude": 72.1575,
    "coordinates": [
      23.4191,
      72.1575
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-061",
    "name": "Installation of Solar High Mast Lights in Ward 31",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 7442169,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Ahmedabad",
    "state": "Gujarat",
    "contractor": "Apex Contractors",
    "latitude": 8.89,
    "longitude": 72.7116,
    "coordinates": [
      8.89,
      72.7116
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-062",
    "name": "Installation of Solar High Mast Lights in Ward 6",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 1295853,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Bengaluru",
    "state": "Karnataka",
    "contractor": "Reddy & Sons",
    "latitude": 21.5759,
    "longitude": 87.952,
    "coordinates": [
      21.5759,
      87.952
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-063",
    "name": "Construction of CC Road in Nagpur",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 399143,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Nagpur",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 14.045,
    "longitude": 84.0367,
    "coordinates": [
      14.045,
      84.0367
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-064",
    "name": "Construction of Community Hall in Pune",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 895507,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Pune",
    "state": "Maharashtra",
    "contractor": "Singh Builders",
    "latitude": 29.3961,
    "longitude": 81.4857,
    "coordinates": [
      29.3961,
      81.4857
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-065",
    "name": "Installation of Solar High Mast Lights in Ward 43",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 2673141,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "contractor": "L&T Local",
    "latitude": 9.1,
    "longitude": 79.6766,
    "coordinates": [
      9.1,
      79.6766
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-066",
    "name": "Upgradation of Public Library in Guntur",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 4224511,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Guntur",
    "state": "Andhra Pradesh",
    "contractor": "TechVision Suppliers",
    "latitude": 14.991,
    "longitude": 89.1907,
    "coordinates": [
      14.991,
      89.1907
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-067",
    "name": "Construction of Community Hall in Salem",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 1000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Salem",
    "state": "Tamil Nadu",
    "contractor": "Singh Builders",
    "latitude": 27.2494,
    "longitude": 89.7341,
    "coordinates": [
      27.2494,
      89.7341
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-068",
    "name": "Construction of Community Hall in Vadodara",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 3870459,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Flagged",
    "district": "Vadodara",
    "state": "Gujarat",
    "contractor": "Surya Infra",
    "latitude": 17.4797,
    "longitude": 76.8774,
    "coordinates": [
      17.4797,
      76.8774
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-069",
    "name": "Provision of RO Water Plant at Surat Govt Hospital",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Surat",
    "state": "Gujarat",
    "contractor": "L&T Local",
    "latitude": 15.356,
    "longitude": 74.801,
    "coordinates": [
      15.356,
      74.801
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-070",
    "name": "Construction of Additional Classrooms in ZP School, Mumbai Suburban",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 5864554,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 23.9759,
    "longitude": 87.9541,
    "coordinates": [
      23.9759,
      87.9541
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-071",
    "name": "Construction of Additional Classrooms in ZP School, Nagpur",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 15000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Nagpur",
    "state": "Maharashtra",
    "contractor": "KV Constructions",
    "latitude": 27.6605,
    "longitude": 74.0434,
    "coordinates": [
      27.6605,
      74.0434
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-072",
    "name": "Installation of Solar High Mast Lights in Ward 20",
    "scheme": "MPLADS",
    "budget": 2000000,
    "spent": 1786333,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Flagged",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "contractor": "Surya Infra",
    "latitude": 25.693,
    "longitude": 73.8722,
    "coordinates": [
      25.693,
      73.8722
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-073",
    "name": "Construction of Additional Classrooms in ZP School, Thiruvananthapuram",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 56249,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Thiruvananthapuram",
    "state": "Kerala",
    "contractor": "National Builders",
    "latitude": 28.7248,
    "longitude": 84.3341,
    "coordinates": [
      28.7248,
      84.3341
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-074",
    "name": "Installation of Open Gym Equipment in Madurai Park",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 5000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "contractor": "Singh Builders",
    "latitude": 22.4074,
    "longitude": 85.4789,
    "coordinates": [
      22.4074,
      85.4789
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-075",
    "name": "Construction of Community Hall in Amritsar",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Amritsar",
    "state": "Punjab",
    "contractor": "TechVision Suppliers",
    "latitude": 23.2148,
    "longitude": 80.11,
    "coordinates": [
      23.2148,
      80.11
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-076",
    "name": "Upgradation of Public Library in Chennai",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 900372,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "contractor": "Reddy & Sons",
    "latitude": 17.3324,
    "longitude": 81.9704,
    "coordinates": [
      17.3324,
      81.9704
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-077",
    "name": "Upgradation of Public Library in Thiruvananthapuram",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 5671366,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Thiruvananthapuram",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 19.309,
    "longitude": 87.4552,
    "coordinates": [
      19.309,
      87.4552
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-078",
    "name": "Construction of CC Road in Ahmedabad",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 12000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Ahmedabad",
    "state": "Gujarat",
    "contractor": "Singh Builders",
    "latitude": 28.3843,
    "longitude": 70.2815,
    "coordinates": [
      28.3843,
      70.2815
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-079",
    "name": "Installation of Solar High Mast Lights in Ward 30",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Rajkot",
    "state": "Gujarat",
    "contractor": "Surya Infra",
    "latitude": 18.005,
    "longitude": 79.6276,
    "coordinates": [
      18.005,
      79.6276
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-080",
    "name": "Installation of Solar High Mast Lights in Ward 3",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 1192480,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Salem",
    "state": "Tamil Nadu",
    "contractor": "Singh Builders",
    "latitude": 10.1583,
    "longitude": 80.9206,
    "coordinates": [
      10.1583,
      80.9206
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-081",
    "name": "Construction of Community Hall in Kozhikode",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 681970,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Kozhikode",
    "state": "Kerala",
    "contractor": "KV Constructions",
    "latitude": 9.984,
    "longitude": 89.7363,
    "coordinates": [
      9.984,
      89.7363
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-082",
    "name": "Installation of Open Gym Equipment in Kozhikode Park",
    "scheme": "MPLADS",
    "budget": 3500000,
    "spent": 3500000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Kozhikode",
    "state": "Kerala",
    "contractor": "Apex Contractors",
    "latitude": 23.1852,
    "longitude": 71.6511,
    "coordinates": [
      23.1852,
      71.6511
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-083",
    "name": "Purchase of 23 Ambulances for PHC, Rajkot",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 12000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Rajkot",
    "state": "Gujarat",
    "contractor": "KV Constructions",
    "latitude": 28.5543,
    "longitude": 78.7487,
    "coordinates": [
      28.5543,
      78.7487
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-084",
    "name": "Construction of Community Hall in Hubballi",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 425984,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Hubballi",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 11.8639,
    "longitude": 73.7014,
    "coordinates": [
      11.8639,
      73.7014
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-085",
    "name": "Construction of CC Road in Bengaluru",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 3993020,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Bengaluru",
    "state": "Karnataka",
    "contractor": "KV Constructions",
    "latitude": 25.3799,
    "longitude": 83.7734,
    "coordinates": [
      25.3799,
      83.7734
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-086",
    "name": "Installation of Open Gym Equipment in Agra Park",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 4331268,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Agra",
    "state": "Uttar Pradesh",
    "contractor": "L&T Local",
    "latitude": 23.0527,
    "longitude": 80.9893,
    "coordinates": [
      23.0527,
      80.9893
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-087",
    "name": "Installation of Open Gym Equipment in Kanpur Park",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 1546407,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Kanpur",
    "state": "Uttar Pradesh",
    "contractor": "L&T Local",
    "latitude": 13.1331,
    "longitude": 76.1355,
    "coordinates": [
      13.1331,
      76.1355
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-088",
    "name": "Upgradation of Public Library in Salem",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Salem",
    "state": "Tamil Nadu",
    "contractor": "Reddy & Sons",
    "latitude": 29.5795,
    "longitude": 78.8304,
    "coordinates": [
      29.5795,
      78.8304
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-089",
    "name": "Purchase of 43 Ambulances for PHC, Jalandhar",
    "scheme": "MPLADS",
    "budget": 500000,
    "spent": 457217,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Jalandhar",
    "state": "Punjab",
    "contractor": "Surya Infra",
    "latitude": 26.4638,
    "longitude": 81.9911,
    "coordinates": [
      26.4638,
      81.9911
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-090",
    "name": "Construction of CC Road in Guntur",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 10509836,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Guntur",
    "state": "Andhra Pradesh",
    "contractor": "TechVision Suppliers",
    "latitude": 10.0224,
    "longitude": 88.3649,
    "coordinates": [
      10.0224,
      88.3649
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-091",
    "name": "Construction of Additional Classrooms in ZP School, Ludhiana",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Ludhiana",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 22.5342,
    "longitude": 86.278,
    "coordinates": [
      22.5342,
      86.278
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-092",
    "name": "Construction of CC Road in Thane",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 7618414,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Thane",
    "state": "Maharashtra",
    "contractor": "Singh Builders",
    "latitude": 8.7354,
    "longitude": 77.4406,
    "coordinates": [
      8.7354,
      77.4406
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-093",
    "name": "Installation of Solar High Mast Lights in Ward 20",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 0,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Registered",
    "district": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "contractor": "Apex Contractors",
    "latitude": 10.0419,
    "longitude": 83.4466,
    "coordinates": [
      10.0419,
      83.4466
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-094",
    "name": "Installation of Open Gym Equipment in Chennai Park",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 1100384,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Flagged",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "contractor": "Reddy & Sons",
    "latitude": 18.2235,
    "longitude": 78.6566,
    "coordinates": [
      18.2235,
      78.6566
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-095",
    "name": "Installation of Solar High Mast Lights in Ward 28",
    "scheme": "MPLADS",
    "budget": 12000000,
    "spent": 7872512,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Varanasi",
    "state": "Uttar Pradesh",
    "contractor": "National Builders",
    "latitude": 12.8103,
    "longitude": 75.2263,
    "coordinates": [
      12.8103,
      75.2263
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-096",
    "name": "Upgradation of Public Library in Coimbatore",
    "scheme": "MPLADS",
    "budget": 8000000,
    "spent": 8000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Coimbatore",
    "state": "Tamil Nadu",
    "contractor": "Surya Infra",
    "latitude": 16.6344,
    "longitude": 74.3258,
    "coordinates": [
      16.6344,
      74.3258
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-097",
    "name": "Installation of Solar High Mast Lights in Ward 34",
    "scheme": "MPLADS",
    "budget": 15000000,
    "spent": 3757508,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "contractor": "Singh Builders",
    "latitude": 21.5763,
    "longitude": 83.8208,
    "coordinates": [
      21.5763,
      83.8208
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-098",
    "name": "Upgradation of Public Library in Vijayawada",
    "scheme": "MPLADS",
    "budget": 5000000,
    "spent": 5000000,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Completed",
    "district": "Vijayawada",
    "state": "Maharashtra",
    "contractor": "Surya Infra",
    "latitude": 21.1624,
    "longitude": 72.4791,
    "coordinates": [
      21.1624,
      72.4791
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-099",
    "name": "Installation of Open Gym Equipment in Thiruvananthapuram Park",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 315456,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Delayed",
    "district": "Thiruvananthapuram",
    "state": "Kerala",
    "contractor": "KV Constructions",
    "latitude": 9.6429,
    "longitude": 71.6876,
    "coordinates": [
      9.6429,
      71.6876
    ],
    "riskScore": 0
  },
  {
    "id": "PRJ-2023-100",
    "name": "Purchase of 25 Ambulances for PHC, Ernakulam",
    "scheme": "MPLADS",
    "budget": 1000000,
    "spent": 1496547,
    "startDate": "2023-05-10",
    "endDate": "2024-05-10",
    "status": "Active",
    "district": "Ernakulam",
    "state": "Kerala",
    "contractor": "Surya Infra",
    "latitude": 20.5931,
    "longitude": 87.0522,
    "coordinates": [
      20.5931,
      87.0522
    ],
    "riskScore": 0
  }
];

export const riskFactorsById: Record<string, RiskFactor[]> = {};

for (const project of mockProjects) {
  const { score, factors } = computeRisk(project, mockProjects);
  project.riskScore = score;
  riskFactorsById[project.id] = factors;
}
