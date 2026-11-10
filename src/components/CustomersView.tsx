import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Building } from 'lucide-react';
import { Conversation } from '../types';

interface CustomersViewProps {
  conversations: Conversation[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ conversations }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique customers from conversations
  const customersMap = new Map();
  conversations.forEach((c) => {
    if (!customersMap.has(c.customerEmail)) {
      customersMap.set(c.customerEmail, {
        name: c.customerName,
        email: c.customerEmail,
        phone: c.customerPhone,
        company: c.company || 'Não informada',
        avatar: c.customerAvatar,
        channel: c.channel,
        sentiment: c.sentiment,
      });
    }
  });

  const customers = Array.from(customersMap.values()).filter(
    (cust) =>
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Diretório de Clientes CRM</h2>
          <p className="text-slate-500 text-sm mt-1">Histórico e dados consolidados dos clientes atendidos em todos os canais.</p>
        </div>
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar cliente por nome ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((cust, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition-all">
            <div className="flex items-center gap-3.5">
              <img src={cust.avatar} alt={cust.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">{cust.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <Building className="w-3.5 h-3.5" /> {cust.company}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <p className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate">{cust.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span>{cust.phone}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Canal Principal: {cust.channel}
              </span>
              <span className="text-xs text-slate-500 font-medium">Ativo no CRM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
