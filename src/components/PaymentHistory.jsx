import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  IndianRupee, 
  Filter,
  History,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

const PaymentHistory = () => {
  const [paymentList, setPaymentList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  const getPaymentHistory = () => {
    setIsLoading(true);
    api.get('/fee/payment-history', { params })
      .then((res) => {
        setPaymentList(res.data.paymentHistory || []);
        setMeta(res.data.meta || null);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      getPaymentHistory();
    }, 300);
    return () => clearTimeout(t);
  }, [params]);

  const openReceipt = async (feeId) => {
    try {
      toast.info("Generating receipt...");
      const res = await api.get(`/receipt/fee/${feeId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* --- HEADER & STATS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/20">
              <History size={24} className="text-white" />
            </div>
            Payment Ledger
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-semibold text-[10px]">Financial Transaction Logs</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Entries</p>
            <p className="text-xl font-black text-white leading-tight">{meta?.totalDocs || 0}</p>
          </div>
          <select
            className="bg-slate-950 border border-white/10 text-slate-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-all cursor-pointer"
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
          >
            {[10, 20, 50].map(v => <option key={v} value={v}>{v} / page</option>)}
          </select>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input
          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:bg-black focus:border-emerald-500/50 outline-none transition-all"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search by student name, phone or remark..."
        />
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-black/20 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                <th className="px-6 py-5">Student Information</th>
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Note/Remark</th>
                <th className="px-6 py-5 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-slate-500 text-sm font-medium italic">Fetching transactions...</p>
                      </div>
                    </td>
                  </tr>
                ) : paymentList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <Filter size={48} />
                        <p className="text-lg font-bold">No Records Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paymentList.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            {payment.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">{payment.fullName}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">Ref: {payment._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span className="text-slate-200 font-medium">{new Date(payment.createdAt).toLocaleDateString('en-GB')}</span>
                          <span className="text-slate-500 text-[10px] uppercase tracking-tighter">
                            {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-emerald-400 font-black">
                          <span className="text-xs font-normal opacity-70">₹</span>
                          {payment.amount.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-400 italic max-w-[150px] truncate group-hover:max-w-none transition-all">
                          {payment.remark || <span className="opacity-30">No remark</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => openReceipt(payment._id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 hover:border-emerald-500 transition-all active:scale-95 group/btn shadow-lg"
                          >
                            <FileText size={14} className="group-hover/btn:scale-110 transition-transform" />
                            View PDF
                            <ExternalLink size={10} className="opacity-40" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FOOTER / PAGINATION --- */}
      <div className="flex justify-center pt-4">
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default PaymentHistory;