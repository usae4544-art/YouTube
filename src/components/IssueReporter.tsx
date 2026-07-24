import React, { useState, useEffect, useRef } from "react";
import { Plus, X, Image as ImageIcon, Video, Send, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import { GoogleUser } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface Reply {
  id: string;
  userEmail: string;
  userPicture?: string;
  userName?: string;
  description: string;
  attachment?: string;
  attachmentType?: 'image' | 'video';
  createdAt: string;
}

interface Issue {
  id: string;
  userEmail: string;
  userPicture?: string;
  userName?: string;
  description: string;
  attachment?: string;
  attachmentType?: 'image' | 'video';
  isImportant?: boolean;
  replies?: Reply[];
  createdAt: string;
}

interface IssueReporterProps {
  user: GoogleUser | null;
  isPremium: boolean;
}

export default function IssueReporter({ user, isPremium }: IssueReporterProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<'image' | 'video' | null>(null);
  const [isImportant, setIsImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDescription, setReplyDescription] = useState("");
  const [replyAttachment, setReplyAttachment] = useState<string | null>(null);
  const [replyAttachmentType, setReplyAttachmentType] = useState<'image' | 'video' | null>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyUploadProgress, setReplyUploadProgress] = useState(0);

  useEffect(() => {
    if (user) {
      // Connect to the SSE endpoint for real-time updates
      const eventSource = new EventSource('/api/issues/stream');
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setIssues(data);
        } catch (e) {
          console.error("Failed to parse issues update", e);
        }
      };

      eventSource.onerror = (e) => {
        console.error("EventSource failed.", e);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user]);

  // Keep this around if we still want to manually fetch, but SSE provides initial data too.
  const fetchIssues = async () => {
    try {
      const res = await fetch("/api/issues");
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (e) {
      console.error("Failed to fetch issues", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isReply: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('video/') ? 'video' : 'image';
    
    if (isReply) {
      setReplyAttachmentType(type);
    } else {
      setAttachmentType(type);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (isReply) {
          setReplyAttachment(event.target.result as string);
        } else {
          setAttachment(event.target.result as string);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const simulateUploadProgress = (setProg: (v: number) => void) => {
    return new Promise<void>((resolve) => {
      // Fast speed for premium, Standard for free users
      const totalTimeMs = isPremium ? 800 : 3500; 
      const steps = 10;
      const stepTime = totalTimeMs / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += 10;
        setProg(current);
        if (current >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, stepTime);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !user) return;

    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      await simulateUploadProgress(setUploadProgress);
      
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          userPicture: user.picture,
          userName: user.name,
          description,
          attachment,
          attachmentType,
          isImportant
        })
      });

      if (res.ok) {
        // SSE will provide the updated list, no need to manually update state here
        setDescription("");
        setAttachment(null);
        setAttachmentType(null);
        setIsImportant(false);
      }
    } catch (error) {
      console.error("Failed to post issue", error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleReplySubmit = async (issueId: string) => {
    if (!replyDescription.trim() || !user) return;
    
    setIsSubmittingReply(true);
    setReplyUploadProgress(0);
    
    try {
      await simulateUploadProgress(setReplyUploadProgress);
      
      const res = await fetch(`/api/issues/${issueId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          userPicture: user.picture,
          userName: user.name,
          description: replyDescription,
          attachment: replyAttachment,
          attachmentType: replyAttachmentType
        })
      });

      if (res.ok) {
        // SSE will provide the updated list, no need to manually update state here
        setReplyingTo(null);
        setReplyDescription("");
        setReplyAttachment(null);
        setReplyAttachmentType(null);
      }
    } catch (error) {
      console.error("Failed to post reply", error);
    } finally {
      setIsSubmittingReply(false);
      setReplyUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <div 
        className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full bg-gray-900 border-x border-white/10 shadow-2xl p-8 text-center"
      >
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Login Required</h2>
        <p className="text-gray-400">Please sign in from the Profile tab to access the Report / Error Mode and community issues.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col h-full bg-gray-900 border-x border-white/10 shadow-2xl overflow-hidden">
      <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xl text-gray-100 flex items-center gap-2">
            <AlertCircle className="text-amber-500" />
            Report / Error Mode
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Upload speed: <span className={isPremium ? "text-green-400 font-bold" : "text-gray-300"}>{isPremium ? "Fast (Premium)" : "Standard (Free)"}</span>
          </p>
        </div>
      </div>
         
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
           
        {/* Submit New Issue */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner">
          <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
            <Plus size={16} /> Report a new issue
          </h4>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the bug or issue you are experiencing..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    
                    {attachment && (
                      <div className="relative self-start mt-2">
                        {attachmentType === 'image' ? (
                          <img src={attachment} alt="Preview" className="h-32 rounded-lg border border-white/20 object-cover" />
                        ) : (
                          <video src={attachment} className="h-32 rounded-lg border border-white/20 object-cover" />
                        )}
                        <button 
                          type="button" 
                          onClick={() => { setAttachment(null); setAttachmentType(null); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between w-full mt-2 pt-3 border-t border-white/5">
                      <div className="flex-1 flex justify-start">
                        <input 
                          type="file" 
                          accept="image/*,video/*" 
                          ref={fileInputRef}
                          onChange={(e) => handleFileChange(e, false)}
                          className="hidden" 
                        />
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-gray-300 hover:text-blue-400 hover:bg-white/5 px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 font-medium"
                        >
                          <ImageIcon size={16} /> Add Photo/Video
                        </button>
                      </div>

                      <div className="flex-1 flex justify-center">
                        <motion.label 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all duration-300 border ${
                            isImportant 
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                              : "text-gray-400 border-transparent hover:bg-white/5 hover:text-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isImportant}
                            onChange={(e) => setIsImportant(e.target.checked)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isImportant ? "bg-amber-500 border-amber-500 text-black" : "border-gray-500 bg-transparent"
                          }`}>
                            <AnimatePresence>
                              {isImportant && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <AlertCircle size={12} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <span className="font-medium">Important</span>
                        </motion.label>
                      </div>
                      
                      <div className="flex-1 flex justify-end items-center gap-3">
                        {isSubmitting && (
                          <div className="flex items-center gap-2 text-xs text-blue-400">
                            Uploading {uploadProgress}%
                          </div>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit" 
                          disabled={isSubmitting || !description.trim()}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {isSubmitting ? 'Posting...' : 'Post Issue'}
                            {isSubmitting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            )}
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="h-px bg-white/10 w-full my-6"></div>

                <h4 className="font-semibold text-gray-300 mb-4 px-1">Community Issues</h4>

                {/* List of Issues */}
                {issues.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No issues reported yet.</p>
                ) : (
                  <div className="space-y-6">
                    {issues.map(issue => (
                      <div key={issue.id} className="bg-gray-800 border border-white/5 rounded-xl overflow-hidden shadow-lg">
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            {issue.userPicture ? (
                              <img src={issue.userPicture} alt={issue.userName || "User"} className="w-8 h-8 rounded-full shadow-sm" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm text-white font-bold shadow-sm">
                                {(issue.userName || issue.userEmail)[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                {issue.userName || issue.userEmail}
                                {issue.isImportant && (
                                  <span className="bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                                    Important
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-200 whitespace-pre-wrap">{issue.description}</p>
                          
                          {issue.attachment && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-white/10 bg-black/50 inline-block max-w-full">
                              {issue.attachmentType === 'image' ? (
                                <img src={issue.attachment} alt="Issue attachment" className="max-h-80 object-contain" />
                              ) : (
                                <video src={issue.attachment} controls className="max-h-80 w-full" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Replies Section */}
                        <div className="bg-gray-900/50 p-4 border-t border-white/5">
                          {issue.replies && issue.replies.length > 0 && (
                            <div className="space-y-4 mb-4">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Replies & Solutions</h5>
                              {issue.replies.map(reply => (
                                <div key={reply.id} className="flex gap-3 pl-2 border-l-2 border-white/10 ml-2">
                                  {reply.userPicture ? (
                                    <img src={reply.userPicture} alt="User" className="w-6 h-6 rounded-full flex-shrink-0" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                                      {(reply.userName || reply.userEmail)[0].toUpperCase()}
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-xs font-semibold text-gray-300">{reply.userName || reply.userEmail}</span>
                                      <span className="text-[10px] text-gray-500">{new Date(reply.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{reply.description}</p>
                                    
                                    {reply.attachment && (
                                      <div className="mt-2 rounded border border-white/10 overflow-hidden max-w-sm">
                                        {reply.attachmentType === 'image' ? (
                                          <img src={reply.attachment} alt="Reply attachment" className="max-h-48 object-contain" />
                                        ) : (
                                          <video src={reply.attachment} controls className="max-h-48 w-full" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {replyingTo === issue.id ? (
                            <div className="mt-4 bg-white/5 p-3 rounded-lg border border-white/10">
                              <textarea 
                                value={replyDescription}
                                onChange={(e) => setReplyDescription(e.target.value)}
                                placeholder="Write a reply or provide a solution..."
                                className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm text-white resize-none h-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              
                              {replyAttachment && (
                                <div className="relative inline-block mt-2">
                                  {replyAttachmentType === 'image' ? (
                                    <img src={replyAttachment} alt="Preview" className="h-16 rounded border border-white/20" />
                                  ) : (
                                    <video src={replyAttachment} className="h-16 rounded border border-white/20" />
                                  )}
                                  <button 
                                    type="button" 
                                    onClick={() => { setReplyAttachment(null); setReplyAttachmentType(null); }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="file" 
                                    accept="image/*,video/*" 
                                    ref={replyFileInputRef}
                                    onChange={(e) => handleFileChange(e, true)}
                                    className="hidden" 
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => replyFileInputRef.current?.click()}
                                    className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1"
                                  >
                                    <ImageIcon size={14} /> Add Media
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => { setReplyingTo(null); setReplyAttachment(null); setReplyDescription(""); }}
                                    className="text-xs text-gray-400 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => handleReplySubmit(issue.id)}
                                    disabled={isSubmittingReply || !replyDescription.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1"
                                  >
                                    {isSubmittingReply ? `Uploading ${replyUploadProgress}%` : 'Post Reply'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => { 
                                setReplyingTo(issue.id); 
                                setReplyDescription(""); 
                                setReplyAttachment(null); 
                              }}
                              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 mt-2 font-medium"
                            >
                              <MessageCircle size={14} /> Reply / Post Solution
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
    </div>
  );
}
