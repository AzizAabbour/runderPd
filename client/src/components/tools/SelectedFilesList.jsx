import { motion, AnimatePresence } from 'framer-motion';
import { File, Image, Video, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatBytes } from '@/utils/format';
import { isImageFile, isPdfFile, isVideoFile } from '@/utils/file';

function getIcon(file) {
  if (isImageFile(file)) return Image;
  if (isVideoFile(file)) return Video;
  if (isPdfFile(file)) return File;
  return File;
}

export function SelectedFilesList({ files = [], onRemove, onClear }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-white">Selected files</h4>
          <p className="text-sm text-slate-400">{files.length} file(s) ready</p>
        </div>
        {files.length ? (
          <Button variant="secondary" size="sm" onClick={onClear}>
            Clear all
          </Button>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <AnimatePresence>
          {files.length ? (
            files.map((item) => {
              const Icon = getIcon(item.file);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10 text-cyan-300">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.file.name}</p>
                    <p className="text-xs text-slate-400">
                      {formatBytes(item.file.size)} · {item.file.type || 'unknown'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove?.(item.id)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
              No files selected yet.
            </div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
