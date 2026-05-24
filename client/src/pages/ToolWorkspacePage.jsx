import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { SelectedFilesList } from '@/components/tools/SelectedFilesList';
import { ToolSettingsPanel } from '@/components/tools/ToolSettingsPanel';
import { ProcessingPanel } from '@/components/tools/ProcessingPanel';
import { getToolById } from '@/data/tools';
import { submitToolJob } from '@/services/toolsApi';
import { useToast } from '@/contexts/ToastContext';
import { useJobPolling } from '@/hooks/useJobPolling';
import { isImageFile } from '@/utils/file';
import { formatBytes } from '@/utils/format';

function buildDefaultSettings(tool) {
  return Object.fromEntries((tool?.settings ?? []).map((setting) => [setting.key, setting.defaultValue]));
}

function createFileItem(file) {
  const previewUrl = isImageFile(file) ? URL.createObjectURL(file) : null;
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl,
  };
}

export function ToolWorkspacePage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const tool = getToolById(toolId);
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState(() => buildDefaultSettings(tool));
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const completionToastShown = useRef(false);
  const { job, loading: pollingLoading } = useJobPolling(jobId, Boolean(jobId));

  useEffect(() => {
    if (!tool) return;
    setFiles([]);
    setSettings(buildDefaultSettings(tool));
    setUploadProgress(0);
    setJobId(null);
    setProcessing(false);
    setDownloadUrl('');
    completionToastShown.current = false;
  }, [toolId, tool]);

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [files]);

  useEffect(() => {
    if (job?.downloadUrl) {
      setDownloadUrl(job.downloadUrl);
    }

    if (job?.status === 'complete' && !completionToastShown.current) {
      completionToastShown.current = true;
      setProcessing(false);
      setUploadProgress(100);
      toast.success('Processing complete', 'Your file is ready to download.');
    }

    if (job?.status === 'failed') {
      setProcessing(false);
      toast.error('Processing failed', job.error ?? 'Please try again.');
    }
  }, [job, toast]);

  const fileSummary = useMemo(() => {
    const totalBytes = files.reduce((sum, item) => sum + item.file.size, 0);
    return {
      count: files.length,
      totalBytes,
    };
  }, [files]);

  const handleFiles = (incomingFiles) => {
    if (!tool) return;
    const incoming = Array.from(incomingFiles ?? []).map(createFileItem);

    setFiles((current) => {
      const nextFiles = tool.multiple
        ? [...current, ...incoming]
        : incoming.slice(0, 1);

      if (nextFiles.length === 0) return [];

      if (!tool.multiple && current[0]?.previewUrl) {
        URL.revokeObjectURL(current[0].previewUrl);
      }

      return nextFiles.slice(0, tool.maxFiles ?? 12);
    });
  };

  const removeFile = (id) => {
    setFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const clearFiles = () => {
    files.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFiles([]);
  };

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!tool) return;

    if (!files.length || (tool.minFiles ?? 1) > files.length) {
      toast.error('Add files first', `This tool requires at least ${tool.minFiles ?? 1} file(s).`);
      return;
    }

    const formData = new FormData();
    files.forEach((item) => {
      formData.append('files', item.file);
    });
    formData.append('options', JSON.stringify(settings));

    setProcessing(true);
    setUploadProgress(6);
    setJobId(null);
    setDownloadUrl('');
    completionToastShown.current = false;

    try {
      const response = await submitToolJob(tool.id, formData, {
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded / event.total) * 55);
          setUploadProgress(Math.max(6, Math.min(55, percent)));
        },
      });

      setJobId(response.data.job.id);
      setUploadProgress(response.data.job.progress ?? 58);
    } catch (error) {
      setProcessing(false);
      toast.error('Upload failed', error?.response?.data?.message ?? 'Please try again.');
    }
  };

  const handleDownload = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!tool) {
    return (
      <Card className="p-6">
        <p className="text-lg font-semibold text-white">Tool not found</p>
        <p className="mt-2 text-sm text-slate-300">
          The selected tool does not exist in this workspace.
        </p>
        <Button className="mt-5" onClick={() => navigate('/dashboard/tools')}>
          Go back
        </Button>
      </Card>
    );
  }

  const progressValue = job?.progress ?? uploadProgress;
  const status = job?.status ?? (processing ? 'processing' : 'ready');

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={tool.category}
        title={tool.title}
        description={tool.description}
        action={
          <ButtonLink to="/dashboard/tools" variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to tools
          </ButtonLink>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <div className="space-y-6">
          <UploadDropzone
            accept={tool.accept}
            multiple={tool.multiple}
            files={files.map((item) => item.file)}
            onFiles={handleFiles}
            title={`Upload ${tool.title.toLowerCase()}`}
            hint={`Supports ${tool.accept || 'common file types'} with instant processing feedback.`}
          />

          <SelectedFilesList
            files={files}
            onRemove={removeFile}
            onClear={clearFiles}
          />

          <ToolSettingsPanel
            settings={tool.settings}
            values={settings}
            onChange={updateSetting}
            title="Processing settings"
          />

          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-white">File summary</h4>
                <p className="text-sm text-slate-400">Quick overview of the selected files.</p>
              </div>
              <Badge variant="accent">{fileSummary.count} file(s)</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total size</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {formatBytes(fileSummary.totalBytes)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Mode</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {tool.multiple ? 'Batch processing' : 'Single file'}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSubmit} disabled={processing}>
              <Sparkles className="h-4 w-4" />
              {processing ? 'Processing...' : 'Start processing'}
            </Button>
            <Button variant="secondary" onClick={clearFiles} disabled={!files.length || processing}>
              <RefreshCw className="h-4 w-4" />
              Reset files
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <ProcessingPanel
            status={status}
            progress={progressValue}
            job={job}
            downloadUrl={downloadUrl}
            onDownload={handleDownload}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Card className="p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Accepted files</p>
              <p className="mt-2 text-lg font-semibold text-white">{tool.accept || 'All types'}</p>
              <p className="mt-2 text-sm text-slate-400">
                Secure validation is handled on the backend before processing begins.
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Download</p>
              <p className="mt-2 text-lg font-semibold text-white">Instant file link</p>
              <p className="mt-2 text-sm text-slate-400">
                The output file appears as soon as the job status reaches complete.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

