import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudUpload, FileUp, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export function UploadDropzone({
  accept,
  multiple = false,
  files = [],
  onFiles,
  hint = 'Drag & drop files here or click to browse',
  title = 'Upload files',
  helperText = 'Secure uploads with instant processing feedback.',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (incomingFiles) => {
    const nextFiles = Array.from(incomingFiles ?? []).filter(Boolean);
    if (nextFiles.length) {
      onFiles?.(multiple ? nextFiles : nextFiles.slice(0, 1));
    }
  };

  return (
    <Card
      onClick={openPicker}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        'relative cursor-pointer overflow-hidden border-dashed p-6 transition',
        dragging ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 bg-white/5',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5" />
      <div className="relative flex flex-col items-center text-center">
        <motion.div
          animate={dragging ? { scale: 1.05, rotate: -4 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="rounded-full border border-cyan-400/20 bg-cyan-400/10 p-4"
        >
          <CloudUpload className="h-8 w-8 text-cyan-300" />
        </motion.div>
        <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-slate-300">{hint}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{helperText}</p>
        <Button variant="secondary" size="sm" className="mt-5">
          <FileUp className="h-4 w-4" />
          Browse files
        </Button>
      </div>
      <AnimatePresence>
        {dragging ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cyan-400/10"
          />
        ) : null}
      </AnimatePresence>
    </Card>
  );
}

