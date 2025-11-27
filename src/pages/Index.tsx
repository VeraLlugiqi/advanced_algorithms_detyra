"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Copy, Check, Download, X } from "lucide-react";
import { BasicSettings } from "../components/BasicSettings";
import { Channels } from "../components/Channels";
import { PriorityBlocks } from "../components/PriorityBlocks";
import { TimePreferences } from "../components/TimePreference";
import { generateSchedule } from "../lib/generate";
import { kosovoExampleData } from "../lib/kosovoExample";

const configSchema = z.object({
  opening_time: z.number().min(0).max(1440),
  closing_time: z.number().min(0).max(1440),
  min_duration: z.number().min(1),
  max_duration: z.number().min(1),
  min_score: z.number().min(0),
  max_score: z.number().min(0),
  max_consecutive_genre: z.number().min(1),
  channels_count: z.number().min(1),
  switch_penalty: z.number().min(0),
  termination_penalty: z.number().min(0),
}).refine((data) => data.opening_time < data.closing_time, {
  message: "Opening time must be less than closing time",
  path: ["closing_time"],
}).refine((data) => data.min_duration <= data.max_duration, {
  message: "Min duration must be less than or equal to max duration",
  path: ["max_duration"],
}).refine((data) => data.min_score <= data.max_score, {
  message: "Min score must be less than or equal to max score",
  path: ["max_score"],
});

type ConfigFormData = z.infer<typeof configSchema>;

interface ConfigData extends ConfigFormData {
  time_preferences: any[];
  priority_blocks: any[];
  channels: any[];
}

export default function Page() {
  const [timePreferences, setTimePreferences] = useState<any[]>([]);
  const [priorityBlocks, setPriorityBlocks] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [showGeneratedOutput, setShowGeneratedOutput] = useState(false);

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      opening_time: 0,
      closing_time: 630,
      min_duration: 30,
      max_duration: 120,
      min_score: 10,
      max_score: 100,
      max_consecutive_genre: 2,
      channels_count: 24,
      switch_penalty: 5,
      termination_penalty: 10,
    },
  });

  const loadKosovoPreset = () => {
    // Load values from kosovoExampleData
    setValue('opening_time', kosovoExampleData.opening_time);
    setValue('closing_time', kosovoExampleData.closing_time);
    setValue('min_duration', kosovoExampleData.min_duration);
    setValue('max_duration', kosovoExampleData.max_duration);
    setValue('min_score', kosovoExampleData.min_score);
    setValue('max_score', kosovoExampleData.max_score);
    setValue('max_consecutive_genre', kosovoExampleData.max_consecutive_genre);
    setValue('channels_count', kosovoExampleData.channels_count);
    setValue('switch_penalty', kosovoExampleData.switch_penalty);
    setValue('termination_penalty', kosovoExampleData.termination_penalty);
    
    // Convert channels to UI format (add internal id for each program)
    const exampleChannels = kosovoExampleData.channels.map((channel: any) => ({
      id: Date.now().toString() + Math.random(),
      channel_id: channel.channel_id,
      channel_name: channel.channel_name,
      programs: channel.programs.map((prog: any) => ({
        id: Date.now().toString() + Math.random(),
        start: prog.start,
        end: prog.end,
        genre: prog.genre,
        score: prog.score,
      })),
    }));
    
    // Convert priority blocks to UI format
    const examplePriorityBlocks = kosovoExampleData.priority_blocks.map((block: any) => ({
      id: Date.now().toString() + Math.random(),
      start: block.start,
      end: block.end,
      allowed_channels: block.allowed_channels,
    }));
    
    // Convert time preferences to UI format
    const exampleTimePreferences = kosovoExampleData.time_preferences.map((pref: any) => ({
      id: Date.now().toString() + Math.random(),
      start: pref.start,
      end: pref.end,
      preferred_genre: pref.preferred_genre,
      bonus: pref.bonus,
    }));
    
    setChannels(exampleChannels);
    setPriorityBlocks(examplePriorityBlocks);
    setTimePreferences(exampleTimePreferences);
    
    // Also generate and show the JSON output
    // Use setTimeout to ensure form values are updated first
    setTimeout(() => {
      const currentFormValues = watch();
      const fullConfig: ConfigData = {
        ...currentFormValues,
        opening_time: kosovoExampleData.opening_time,
        closing_time: kosovoExampleData.closing_time,
        min_duration: kosovoExampleData.min_duration,
        max_duration: kosovoExampleData.max_duration,
        min_score: kosovoExampleData.min_score,
        max_score: kosovoExampleData.max_score,
        max_consecutive_genre: kosovoExampleData.max_consecutive_genre,
        channels_count: kosovoExampleData.channels_count,
        switch_penalty: kosovoExampleData.switch_penalty,
        termination_penalty: kosovoExampleData.termination_penalty,
        time_preferences: exampleTimePreferences,
        priority_blocks: examplePriorityBlocks,
        channels: exampleChannels,
      };
      const data = generateSchedule(fullConfig);
      handleGenerate(data);
    }, 100);
  };

  const clearAll = () => {
    reset();
    setChannels([]);
    setPriorityBlocks([]);
    setTimePreferences([]);
    setGeneratedData(null);
    setShowGeneratedOutput(false);
  };

  const getGeneratedOutput = () => {
    if (!generatedData) return null;
    return JSON.stringify(generatedData, null, 2);
  };

  const handleCopyJson = () => {
    const output = getGeneratedOutput();
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJson = () => {
    if (!generatedData) return;
    const jsonString = JSON.stringify(generatedData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kosovo_tv_input_generated.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = (data: any) => {
    setGeneratedData(data);
    setShowGeneratedOutput(true);
    // Auto-scroll to output after a short delay
    setTimeout(() => {
      const outputElement = document.getElementById('generated-output');
      if (outputElement) {
        outputElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Instance Generator for TV Channel Scheduling Optimization
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Generate instances for TV channel scheduling problem in public spaces
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadKosovoPreset}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700 active:scale-95 shadow-sm"
              >
          
                Kosovo Example
              </button>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-95 shadow-sm"
              >
                <X size={16} />
                Clear
              </button>
            </div>
          </div>
          {showGeneratedOutput && generatedData && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={handleCopyJson}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-600 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy JSON
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
              >
                <Download size={16} />
                Download JSON
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <BasicSettings
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              timePreferences={timePreferences}
              priorityBlocks={priorityBlocks}
              channels={channels}
              onGenerate={handleGenerate}
              onUpdateChannels={setChannels}
              onUpdateTimePreferences={setTimePreferences}
              onUpdatePriorityBlocks={setPriorityBlocks}
            />
            <TimePreferences
              items={timePreferences}
              onChange={setTimePreferences}
            />
            <PriorityBlocks
              items={priorityBlocks}
              onChange={setPriorityBlocks}
            />
            <Channels items={channels} onChange={setChannels} />
          </div>

          {/* Right Panel - JSON Preview */}
          {showGeneratedOutput && generatedData && (
            <div id="generated-output" className="lg:sticky lg:top-24 lg:h-fit">
              {/* Generated Data Box */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg">
                 <div className="flex items-center justify-between border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                   <div>
                     <h2 className="text-lg font-semibold text-slate-900">
                       Generated Output
                     </h2>
                     <p className="text-xs text-slate-600">
                       {generatedData.channels?.length || 0} channels, {' '}
                       {generatedData.channels?.reduce((sum: number, ch: any) => sum + (ch.programs?.length || 0), 0) || 0} programs, {' '}
                       {generatedData.time_preferences?.length || 0} time preferences, {' '}
                       {generatedData.priority_blocks?.length || 0} priority blocks
                     </p>
                   </div>
                 </div>

                <div className="bg-slate-950 p-6">
                  <pre className="max-h-[600px] overflow-auto rounded-xl bg-slate-900 p-4 text-sm font-mono text-slate-100 leading-relaxed">
                    <code>{getGeneratedOutput()}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
