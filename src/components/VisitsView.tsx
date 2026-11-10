import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, User, CheckCircle2, Plus, Edit2, Trash2, AlertTriangle, Sparkles } from 'lucide-react';
import { Visit } from '../types';

interface VisitsViewProps {
  visits: Visit[];
  onAddVisit: (visit: Visit) => void;
  onUpdateVisit: (visit: Visit) => void;
  onDeleteVisit: (id: string) => void;
  onUpdateVisitStatus: (id: string, status: Visit['status']) => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  visits,
  onAddVisit,
  onUpdateVisit,
  onDeleteVisit,
  onUpdateVisitStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState<Visit['serviceType']>('Dedetização de Baratas/Formigas');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledPeriod, setScheduledPeriod] = useState<Visit['scheduledPeriod']>('Manhã (08h - 12h)');
  const [technicianName, setTechnicianName] = useState('Marcos Silva');
  const [notes, setNotes] = useState('');
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingVisit(null);
    setClientName('');
    setClientPhone('');
    setAddress('');
    setServiceType('Dedetização de Baratas/Formigas');
    setScheduledDate('');
    setScheduledPeriod('Manhã (08h - 12h)');
    setTechnicianName('Marcos Silva');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Visit) => {
    setEditingVisit(v);
    setClientName(v.clientName);
    setClientPhone(v.clientPhone);
    setAddress(v.address);
    setServiceType(v.serviceType);
    setScheduledDate(v.scheduledDate);
    setScheduledPeriod(v.scheduledPeriod);
    setTechnicianName(v.technicianName);
    setNotes(v.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !address || !scheduledDate) return;

    if (editingVisit) {
      const updated: Visit = {
        ...editingVisit,
        clientName,
        clientPhone,
        address,
        serviceType,
        scheduledDate,
        scheduledPeriod,
        technicianName,
        notes,
      };
      onUpdateVisit(updated);
      setToast('Visita técnica atualizada com sucesso!');
    } else {
      const newVisit: Visit = {
        id: `v-${Date.now()}`,
        clientName,
        clientPhone: clientPhone || '+55 11 99999-8888',
        address,
        serviceType,
        scheduledDate,
        scheduledPeriod,
        technicianName,
        status: 'Agendado',
        notes,
      };
      onAddVisit(newVisit);
      setToast('Visita técnica agendada com sucesso!');
    }

    setIsModalOpen(false);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Agendamento & Confirmação de Visitas</h2>
          <p className="text-slate-500 text-sm mt-1">Cadastre, edite e acompanhe as visitas técnicas de dedetização e controle de pragas.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Visita</span>
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {toast}
        </div>
      )}

      {/* Visits list */}
      {visits.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">Nenhuma visita técnica agendada</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Não há visitas cadastradas no momento. Clique no botão abaixo para agendar a primeira visita.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Primeira Visita</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit) => (
          <div key={visit.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  visit.status === 'Confirmado pelo Cliente' ? 'bg-emerald-100 text-emerald-800' :
                  visit.status === 'Concluído' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {visit.status}
                </span>
                <span className="text-xs font-semibold text-slate-500">{visit.scheduledDate}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{visit.clientName}</h3>
                <p className="text-xs font-medium text-emerald-600 mt-0.5">{visit.serviceType}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{visit.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{visit.scheduledPeriod}</span>
                </p>
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Técnico: <strong>{visit.technicianName}</strong></span>
                </p>
              </div>

              {visit.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                  "{visit.notes}"
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <select
                value={visit.status}
                onChange={(e) => onUpdateVisitStatus(visit.id, e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
              >
                <option value="Agendado">Agendado</option>
                <option value="Confirmado pelo Cliente">Confirmado pelo Cliente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
                <option value="Reagendado">Reagendado</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(visit)}
                  className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg border border-slate-200"
                  title="Editar Visita"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(visit.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200"
                  title="Excluir Visita"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add / Edit Visit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {editingVisit ? 'Editar Visita Técnica' : 'Cadastrar Nova Visita Técnica'}
            </h3>
            <form onSubmit={handleSaveVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Carlos"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Serviço</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Dedetização de Baratas/Formigas">Dedetização de Baratas/Formigas</option>
                    <option value="Desratização">Desratização</option>
                    <option value="Descupinização">Descupinização</option>
                    <option value="Sanitização de Ambientes">Sanitização de Ambientes</option>
                    <option value="Inspeção Técnica">Inspeção Técnica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Endereço Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Rua, Número, Bairro, Cidade - SP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data da Visita *</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Período</label>
                  <select
                    value={scheduledPeriod}
                    onChange={(e) => setScheduledPeriod(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Manhã (08h - 12h)">Manhã (08h - 12h)</option>
                    <option value="Tarde (13h - 18h)">Tarde (13h - 18h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Técnico Responsável</label>
                <select
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Marcos Silva">Marcos Silva</option>
                  <option value="Roberto Santos">Roberto Santos</option>
                  <option value="Julio Cesar">Julio Cesar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observações Internas</label>
                <textarea
                  rows={2}
                  placeholder="Instruções para o técnico..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  {editingVisit ? 'Salvar Alterações' : 'Cadastrar Visita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Confirmar Exclusão</h3>
            <p className="text-xs text-slate-500">Tem certeza que deseja remover este agendamento de visita?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteVisit(deleteConfirmId);
                  setDeleteConfirmId(null);
                  setToast('Visita excluída com sucesso!');
                  setTimeout(() => setToast(null), 3000);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
