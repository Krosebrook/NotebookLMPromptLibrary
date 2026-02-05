import React from 'react';
import { X, Globe, Copy, Check, User } from 'lucide-react';
import { Collaborator } from '../types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: Collaborator[];
  onUpdateRole: (id: string, role: Collaborator['role']) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, collaborators, onUpdateRole }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Share Note</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value="https://notebooklm.google.com/share/..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none"
            />
            <button 
              onClick={handleCopyLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">People with access</h3>
            <div className="space-y-3">
              {collaborators.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${user.color}`}>
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {user.name} 
                        {user.id === 'current' && <span className="text-slate-400 font-normal"> (You)</span>}
                      </p>
                      <p className="text-xs text-slate-500">{user.role === 'owner' ? 'Owner' : user.role === 'editor' ? 'Can edit' : 'Can view'}</p>
                    </div>
                  </div>
                  
                  {user.role !== 'owner' ? (
                    <select 
                      value={user.role}
                      onChange={(e) => onUpdateRole(user.id, e.target.value as any)}
                      className="text-sm text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-blue-600 font-medium"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                      <option value="remove">Remove</option>
                    </select>
                  ) : (
                    <span className="text-xs text-slate-400">Owner</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Anyone with the link</p>
                <p className="text-xs text-slate-500">Anyone on the internet with this link can view</p>
              </div>
              <button className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700">Change</button>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;