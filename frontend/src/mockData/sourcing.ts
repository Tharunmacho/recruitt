import { Client, Order, OrderCandidate } from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'CL-001',
    type: 'Association',
    name: 'National Builders Association',
    contactPerson: 'Robert Fox',
    email: 'robert@nba.org',
    phone: '+1 555-0123',
    address: '123 Builder St, Construction City',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'CL-002',
    type: 'Business',
    name: 'TechFlow Logistics',
    contactPerson: 'Sarah Chen',
    email: 'schen@techflow.com',
    phone: '+1 555-0199',
    address: '456 Flow Ave, Supply Chain City',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    clientId: 'CL-001',
    title: 'Senior Project Managers',
    requiredSkillset: 'Project Management, Construction, Leadership',
    headcount: 3,
    expectedSalary: '₹80,000 - ₹120,000',
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
    remarks: 'Urgent requirement for upcoming downtown project.',
    status: 'Open',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ORD-1002',
    clientId: 'CL-002',
    title: 'Manual Drivers',
    requiredSkillset: 'Driving, Logistics, CDL License',
    headcount: 10,
    expectedSalary: '$40,000 - $60,000',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    remarks: 'Need experienced drivers with clean records.',
    status: 'Open',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export const INITIAL_ORDER_CANDIDATES: OrderCandidate[] = [];
