import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Pagination from './Pagination';
import { api, getErrorMessage } from '../lib/api';

const PaymentHistory = () => {
  const MotionTr = motion.tr;
  const [paymentList, setPaymentList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);


  useEffect(()=>{
    getPaymentHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const params = useMemo(
    () => ({ page, limit, q: q.trim(), sortBy: 'createdAt', order: 'desc' }),
    [page, limit, q]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      getPaymentHistory();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const getPaymentHistory = () => {
    setIsLoading(true);
    api
      .get('/fee/payment-history', { params })
      .then((res) => {
        setPaymentList(res.data.paymentHistory || []);
        setMeta(res.data.meta || null);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => setIsLoading(false));
  };

  const openReceipt = async (feeId) => {
    try {
      const res = await api.get(`/receipt/fee/${feeId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="list-toolbar">
        <input
          className="list-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search payments (name / phone / remark)"
        />
        <select
          className="list-select"
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(1);
          }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {isLoading && <div className="inline-loading">Loading…</div>}
      {!isLoading && paymentList.length === 0 && (
        <div className="empty-state">No payments found.</div>
      )}

      <div className='payment-history-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Student's Name</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Remark</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {paymentList.map((payment) => (
              <MotionTr
                key={payment._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <td>{payment.fullName}</td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                <td>{payment.amount}</td>
                <td>{payment.remark}</td>
                <td>
                  <button className="btn-primary" type="button" onClick={() => openReceipt(payment._id)}>
                    <i className="fa-solid fa-file-invoice"></i>
                    Receipt
                  </button>
                </td>
              </MotionTr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  )
}

export default PaymentHistory
