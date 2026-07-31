import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, updateDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ShieldAlert, CheckCircle2, XCircle, KeyRound, Ticket, Loader2 } from "lucide-react";

interface AdminDashboardProps {
  user: any;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email?.toLowerCase() !== "usae4544@gmail.com") return;
    
    setLoading(true);
    const q = query(collection(db, "password_reset_requests"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      reqs.sort((a: any, b: any) => b.timestamp - a.timestamp);
      setRequests(reqs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching requests:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleApprove = async (req: any) => {
    try {
      if (req.issueType === "transfer_code") {
        // Generate transfer code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        
        // Mock user object for transfer if they just provided email
        const transferUser = { email: req.email, name: "Recovered User" };
        
        await setDoc(doc(db, "transfer_codes", code), {
          user: transferUser,
          expiresAt
        });

        const docRef = doc(db, "password_reset_requests", req.id);
        await updateDoc(docRef, { 
          status: "Approved",
          generatedCode: code
        });
        alert(`Transfer code ${code} generated and request approved.`);
      } else {
        // Password Reset
        const auth = getAuth();
        await sendPasswordResetEmail(auth, req.email);
        const docRef = doc(db, "password_reset_requests", req.id);
        await updateDoc(docRef, { status: "Approved" });
        alert("Password reset email sent and request approved.");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleReject = async (req: any) => {
    try {
      const docRef = doc(db, "password_reset_requests", req.id);
      await updateDoc(docRef, { status: "Rejected" });
      alert("Request rejected.");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  if (user?.email?.toLowerCase() !== "usae4544@gmail.com") {
    return <div className="p-8 text-center text-red-500 font-bold">Access Denied</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-bold text-white font-display">Admin Dashboard (Issue Mode)</h2>
        </div>
        <h3 className="text-lg font-semibold text-gray-300">Pending Issues & Requests</h3>
        
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
             <Loader2 className="w-5 h-5 animate-spin" />
             <p>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 transition-all hover:bg-white/10">
                <div className="space-y-2 text-sm text-gray-300 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                     {req.issueType === 'transfer_code' ? (
                       <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center gap-1"><Ticket className="w-3 h-3"/> Transfer Code Request</span>
                     ) : (
                       <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1"><KeyRound className="w-3 h-3"/> Password Reset Request</span>
                     )}
                  </div>
                  <p><strong className="text-white">Email:</strong> {req.email}</p>
                  <p><strong className="text-white">Timestamp:</strong> {new Date(req.timestamp).toLocaleString()}</p>
                  
                  {req.note && (
                    <div className="mt-2 p-3 bg-black/40 rounded-lg border border-white/5">
                      <strong className="text-gray-400 text-xs uppercase tracking-widest block mb-1">User Comment / Note:</strong>
                      <p className="text-white whitespace-pre-wrap">{req.note}</p>
                    </div>
                  )}

                  {req.generatedCode && (
                    <p className="mt-2"><strong className="text-emerald-400">Generated Transfer Code:</strong> <span className="font-mono text-white bg-black/50 px-2 py-1 rounded">{req.generatedCode}</span></p>
                  )}

                  <p className="pt-2"><strong className="text-white">Status:</strong> 
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
                      className="px-4 py-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> {req.issueType === 'transfer_code' ? "Approve & Generate" : "Approve & Send"}
                    </button>
                    <button
                      onClick={() => handleReject(req)}
                      className="px-4 py-2 w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject / Delete
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
