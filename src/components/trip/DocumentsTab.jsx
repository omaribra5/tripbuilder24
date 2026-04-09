import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, Plane, Hotel, QrCode, Ticket, Trash2, ExternalLink, Plus, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'volo', label: 'Flight', icon: Plane, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'hotel', label: 'Hotel', icon: Hotel, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'biglietto', label: 'Tickets', icon: Ticket, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'qr', label: 'QR / Voucher', icon: QrCode, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'altro', label: 'Other', icon: FileText, color: 'bg-slate-50 text-slate-600 border-slate-200' },
];

function DocCard({ doc, onDelete }) {
  const cat = CATEGORIES.find((c) => c.id === doc.category) || CATEGORIES[4];
  const CatIcon = cat.icon;
  const isPDF = doc.type === 'application/pdf' || doc.name?.toLowerCase().endsWith('.pdf');
  const isImage = doc.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.name || '');

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:shadow-sm transition-shadow duration-150">
      <div className="relative h-32 bg-slate-50 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <FileText className="w-8 h-8" />
            <span className="text-xs font-medium uppercase tracking-wider">PDF</span>
          </div>
        )}
        <button
          onClick={() => onDelete(doc.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-md bg-white/90 border border-slate-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-red-50 text-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="p-3">
        <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border mb-2 ${cat.color}`}>
          <CatIcon className="w-3 h-3" />
          {cat.label}
        </div>
        <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open document
        </a>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('volo');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
    onUploaded({
      id: crypto.randomUUID(),
      name: selectedFile.name,
      url: file_url,
      type: selectedFile.type,
      category,
      uploaded_at: new Date().toISOString(),
    });
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
        <h3 className="text-base font-semibold text-slate-900">Upload document</h3>

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-150"
        >
          {selectedFile ? (
            <>
              <FileText className="w-7 h-7 text-indigo-500" />
              <p className="text-sm font-medium text-slate-800 text-center">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <Upload className="w-7 h-7 text-slate-300" />
              <p className="text-sm text-slate-500">Click to select a file</p>
              <p className="text-xs text-slate-400">Images, PDF, QR codes...</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs font-medium transition-all duration-150 ${
                    category === cat.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium py-2 rounded-lg transition-colors duration-150" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-150 disabled:opacity-50"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsTab({ trip, onSave }) {
  const [docs, setDocs] = useState(trip.documents || []);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('tutti');

  const handleUploaded = (doc) => {
    const updated = [...docs, doc];
    setDocs(updated);
    onSave(updated);
  };

  const handleDelete = (id) => {
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    onSave(updated);
  };

  const filtered = activeFilter === 'tutti' ? docs : docs.filter((d) => d.category === activeFilter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Travel documents</h2>
          <p className="text-xs text-slate-500 mt-0.5">{docs.length} files uploaded</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors duration-150"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveFilter('tutti')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
            activeFilter === 'tutti' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          All ({docs.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = docs.filter((d) => d.category === cat.id).length;
          if (count === 0) return null;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                activeFilter === cat.id ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-150"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Upload className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-500">No documents yet</p>
          <p className="text-xs text-slate-400 text-center">Upload boarding passes, hotel bookings, QR codes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((doc) => (
            <DocCard key={doc.id} doc={doc} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <UploadModal onClose={() => setShowModal(false)} onUploaded={handleUploaded} />
      )}
    </div>
  );
}