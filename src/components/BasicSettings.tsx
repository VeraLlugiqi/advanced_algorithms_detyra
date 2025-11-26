"use client";
import { generateSchedule } from "../lib/generate";

interface BasicSettingsProps {
  register: any;
  watch: any;
  errors: any;
  timePreferences: any[];
  priorityBlocks: any[];
  channels: any[];
  onGenerate: (data: any) => void;
}

export function BasicSettings({
  register,
  watch,
  errors,
  timePreferences,
  priorityBlocks,
  channels,
  onGenerate,
}: BasicSettingsProps) {
  const formValues = watch();

    const sliderSettings = [
    {
      key: "opening_time",
      label: "Opening Time",
      min: 0,
      max: 1440,
      unit: "min",
      description: "Start time of broadcast period",
    },
    {
      key: "closing_time",
      label: "Closing Time",
      min: 0,
      max: 1440,
      unit: "min",
      description: "End time of broadcast period",
    },
    {
      key: "min_duration",
      label: "Min Program Duration",
      min: 1,
      max: 120,
      unit: "min",
      description: "Minimum program duration",
    },
    {
      key: "max_duration",
      label: "Max Program Duration",
      min: 1,
      max: 300,
      unit: "min",
      description: "Maximum program duration",
    },
    {
      key: "min_score",
      label: "Min Program Score",
      min: 0,
      max: 100,
      unit: "pts",
      description: "Minimum score for programs",
    },
    {
      key: "max_score",
      label: "Max Program Score",
      min: 0,
      max: 200,
      unit: "pts",
      description: "Maximum score for programs",
    },
    {
      key: "max_consecutive_genre",
      label: "Max Consecutive Genre",
      min: 1,
      max: 10,
      unit: "genre",
      description: "Maximum same genre repetitions",
    },
    {
      key: "channels_count",
      label: "Channels Count",
      min: 1,
      max: 50,
      unit: "channels",
      description: "Total broadcast channels",
    },
    {
      key: "switch_penalty",
      label: "Switch Penalty",
      min: 0,
      max: 20,
      unit: "pts",
      description: "Penalty for channel switches",
    },
    {
      key: "termination_penalty",
      label: "Termination Penalty",
      min: 0,
      max: 20,
      unit: "pts",
      description: "Penalty for early termination",
    },
  ];

  const buildConfig = () => ({
    ...formValues,
    time_preferences: timePreferences,
    priority_blocks: priorityBlocks,
    channels: channels,
  });

  const generateData = () => {
    const fullConfig = buildConfig();
    const data = generateSchedule(fullConfig);
    onGenerate(data);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="flex justify-between items-center border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Basic Settings
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure core scheduling parameters
          </p>
        </div>
        <div>
          <button
            onClick={() => generateData()}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 active:scale-95 shadow-sm"
          >
            Generate Instance
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Sliders */}
        <div className="space-y-6">
          {sliderSettings.map((setting) => (
            <div key={setting.key}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-900">
                    {setting.label}
                  </label>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {setting.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                  <span className="text-xl font-bold text-blue-600">
                    {formValues[setting.key as keyof typeof formValues]}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {setting.unit}
                  </span>
                </div>
              </div>

              <input
                type="range"
                {...register(setting.key as any, { valueAsNumber: true })}
                min={setting.min}
                max={setting.max}
                step={1}
                defaultValue={
                  formValues[setting.key as keyof typeof formValues]
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              {errors[setting.key] && (
                <p className="mt-1 text-xs text-red-600">
                  {errors[setting.key].message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
