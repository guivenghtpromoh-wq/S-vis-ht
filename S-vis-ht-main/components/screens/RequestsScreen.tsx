import React, { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Trash2 } from 'lucide-react';

export const RequestsScreen: React.FC = () => {
  const { user, requests, listenToRequests, updateRequestStatus, showToast } = useApp();

  useEffect(() => {
    if (user?.id) {
      const unsubscribe = listenToRequests(user.id, user.role);
      return () => unsubscribe();
    }
  }, [user?.id, user?.role, listenToRequests]);

  const handleStatusChange = async (requestId: string, newStatus: 'accepted' | 'rejected' | 'completed') => {
    try {
      await updateRequestStatus(requestId, newStatus);
      showToast('Estati demann lan mete ajou!');
    } catch (err) {
      showToast('Erè lè n ap mete ajou estati a.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Aksepte</span>;
      case 'completed':
        return <span className="bg-[#159447]/10 text-[#159447] border border-[#159447]/20 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Fini</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><XCircle className="w-3 h-3" /> Refize</span>;
      default:
        return <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><Clock className="w-3 h-3" /> Ap tann</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none max-w-md mx-auto">
      <ScreenHeader title="Mes Demann" showBack={false} />

      <div className="p-4 space-y-3">
        {requests.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#E5EBE7] text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#159447]/10 text-[#159447] flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#17231C]">Poko gen demann</p>
            <p className="text-[10px] text-[#66736B]">Lè ou mande yon sèvis oswa yon moun mande sèvis ou, l ap afiche la a.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white p-4 rounded-2xl border border-[#E5EBE7] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#17231C]">{req.title}</h3>
                {getStatusBadge(req.status)}
              </div>

              <p className="text-[11px] text-[#66736B] bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E5EBE7]">
                {req.description}
              </p>

              <div className="flex items-center justify-between pt-1 text-[10px] text-[#66736B]">
                <span>Dat: {new Date(req.createdAt).toLocaleDateString()}</span>
                
                {/* Si itilizatè a se pro a, li ka chanje estati demann lan */}
                {user?.role === 'provider' && req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(req.id, 'accepted')}
                      className="bg-[#159447] text-white px-3 py-1 rounded-lg font-bold text-[10px]"
                    >
                      Aksepte
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, 'rejected')}
                      className="bg-rose-500 text-white px-3 py-1 rounded-lg font-bold text-[10px]"
                    >
                      Refize
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
