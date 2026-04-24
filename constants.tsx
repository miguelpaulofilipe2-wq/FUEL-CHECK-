
import React from 'react';

export const ADMIN_EMAIL = 'miguelpaulofilipe2@gmail.com';
export const ADMIN_WHATSAPP = '244922163218'; // Formato internacional para o WhatsApp

export const THEME = {
  primary: '#08677a',
  secondary: '#22c55e',
  dark: '#0c3a4a',
  accent: '#f8fafc'
};

export const SOYO_NEIGHBORHOODS = [
  'Centro',
  'Pangala',
  'Kitona',
  'Kwanda',
  'Bairro Nobre',
  'Kinto',
  'Bairro Militar',
  'Bairro Popular',
  'Soyo Velho'
];

export const INITIAL_STATIONS = [
  {
    id: '1',
    name: 'Sonangol Pangala',
    neighborhood: 'Pangala',
    gasolineStatus: 'AVAILABLE',
    dieselStatus: 'AVAILABLE',
    lastUpdated: new Date().toISOString(),
    contact: '+244 923 000 001'
  },
  {
    id: '2',
    name: 'Pumangol Centro',
    neighborhood: 'Centro',
    gasolineStatus: 'UNAVAILABLE',
    dieselStatus: 'AVAILABLE',
    lastUpdated: new Date().toISOString(),
    contact: '+244 923 000 002'
  },
  {
    id: '3',
    name: 'Posto Kwanda Base',
    neighborhood: 'Kwanda',
    gasolineStatus: 'AVAILABLE',
    dieselStatus: 'UNAVAILABLE',
    lastUpdated: new Date().toISOString(),
    contact: '+244 923 000 003'
  }
];

export const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="10" width="50" height="70" rx="4" fill="#08677a" />
    <rect x="30" y="20" width="40" height="25" rx="2" fill="white" />
    <path d="M75 35 C 85 35, 85 60, 75 60" stroke="#08677a" strokeWidth="4" />
    <circle cx="50" cy="55" r="15" fill="#22c55e" />
    <path d="M42 55 L48 61 L58 49" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
