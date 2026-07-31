import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ShieldAlert, CheckCircle2, XCircle, Clock } from "lucide-react";

interface AdminDashboardProps {
  user: any;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (user?.email?.toLowerCase() !== "usae4544@gmail.com") return;
    setLoading(true);
    try {
      const q = query(collection(db, "password_reset_requests"));
      const snapshot = await getDocs(q);
      const reqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by newest first
      reqs.sort((a: any, b: any) => b.timestamp - a.timestamp);
      setRequests(reqs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleApprove = async (req: any) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, req.email);
      const docRef = doc(db, "password_reset_requests", req.id);
      await updateDoc(docRef, { status: "Approved" });
      fetchRequests();
      alert("Password reset email sent and request approved.");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleReject = async (req: any) => {
    try {
      const docRef = doc(db, "password_reset_requests", req.id);
      await updateDoc(docRef, { status: "Cancelled" });
      fetchRequests();
      alert("Request rejected.");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  if (user?.email?.toLowerCase() !== "usae4544@gmail.com") {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-bold text-white font-display">Admin Dashboard (Issue Mode)</h2>
        </div>

        <h3 className="text-lg font-semibold text-gray-300">Pending Password Reset Requests</h3>
        
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong className="text-white">Email:</strong> {req.email}</p>
                  <p><strong className="text-white">Timestamp:</strong> {new Date(req.timestamp).toLocaleString()}</p>
                  <p><strong className="text-white">Status:</strong> 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      req.status === "PENDING_ISSUE_MODE" ? "bg-amber-500/20 text-amber-400" :
                      req.status === "Approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {req.status}
                    </span>
                  </p>
                </div>
                
                {req.status === "PENDING_ISSUE_MODE" && (
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                    <button
                      onClick={() => handleApprove(req)}
                      className="px-4 py-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(req)}
                      className="px-4 py-2 w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
