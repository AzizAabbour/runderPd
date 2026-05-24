import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/utils/cn';

function RangeField({ setting, value, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">{setting.label}</p>
          {setting.hint ? <p className="text-xs text-slate-400">{setting.hint}</p> : null}
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={setting.min}
        max={setting.max}
        step={setting.step ?? 1}
        value={value}
        onChange={(event) => onChange(setting.key, Number(event.target.value))}
        className="mt-4 w-full accent-cyan-400"
      />
    </div>
  );
}

export function ToolSettingsPanel({ settings = [], values = {}, onChange, title = 'Settings' }) {
  if (!settings.length) return null;

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="text-sm text-slate-400">Fine-tune how the tool processes your files.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {settings.map((setting) => {
          const value = values[setting.key] ?? setting.defaultValue;

          if (setting.type === 'range') {
            return (
              <div key={setting.key} className={cn(setting.key === 'quality' && 'sm:col-span-2')}>
                <RangeField setting={setting} value={value} onChange={onChange} />
              </div>
            );
          }

          if (setting.type === 'select') {
            return (
              <Select
                key={setting.key}
                label={setting.label}
                value={value}
                onChange={(event) => onChange(setting.key, event.target.value)}
              >
                {setting.options?.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-950">
                    {option.label}
                  </option>
                ))}
              </Select>
            );
          }

          if (setting.type === 'number') {
            return (
              <Input
                key={setting.key}
                type="number"
                label={setting.label}
                value={value}
                placeholder={setting.placeholder}
                onChange={(event) => onChange(setting.key, Number(event.target.value))}
              />
            );
          }

          if (setting.type === 'text') {
            return (
              <Input
                key={setting.key}
                label={setting.label}
                value={value}
                placeholder={setting.placeholder}
                onChange={(event) => onChange(setting.key, event.target.value)}
              />
            );
          }

          return null;
        })}
      </div>
    </Card>
  );
}

