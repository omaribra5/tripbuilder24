import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, Plane, Hotel, QrCode, Ticket, Trash2, ExternalLink, Plus, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'volo', label: 'Volo', icon: Plane, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'hotel', label: 'Hotel', icon: Hotel, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'biglietto', label: 'Biglietti', icon: Ticket, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'qr', label: 'QR / Voucher', icon: QrCode, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'altro', label: 'Altro', icon: FileText, color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

function DocCard({ doc, onDelete }) {
  const cat = CATEGORIES.find((c) => c.id === doc.category) || CATEGORIES[4];
  const CatIcon = cat.icon;
  const isPDF = doc.type === 'application/pdf' || doc.name?.toLowerCase().endsWith('.pdf');
  const isImage = doc.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.name || '');

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden group">
      {/* Preview */}
      <div className="relative h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <FileText className="w-10 h-10" />
            <span className="text-xs font-medium uppercase">PDF</span>
          </div>
        )}
        {/* Delete button */}
        <button
          onClick={() => onDelete(doc.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${cat.color}`}>
          <CatIcon className="w-3 h-3" />
          {cat.label}
        </div>
        <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          Apri documento
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <h3 className="text-lg font-bold text-gray-900">Carica documento</h3>

        {/* File picker */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
        >
          {selectedFile ? (
            <>
              <FileText className="w-8 h-8 text-indigo-600" />
              <p className="text-sm font-medium text-gray-800 text-center">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-500">Clicca per selezionare</p>
              <p className="text-xs text-gray-400">Immagini, PDF, QR code...</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
        </div>

        {/* Category */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Categoria</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                    category === cat.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-200'
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
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={uploading}>
            Annulla
          </Button>
          <Button
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Carica'}
          </Button>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Documenti di viaggio</h2>
          <p className="text-sm text-muted-foreground">{docs.length} file caricati</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Aggiungi
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveFilter('tutti')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            activeFilter === 'tutti' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
          }`}
        >
          Tutti ({docs.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = docs.filter((d) => d.category === cat.id).length;
          if (count === 0) return null;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeFilter === cat.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
        >
          <Upload className="w-10 h-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">Nessun documento ancora</p>
          <p className="text-xs text-gray-400">Carica biglietti aerei, prenotazioni hotel, QR code...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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