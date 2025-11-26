'use client'

import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Program {
  id: string  // Internal ID for React keys
  start: number
  end: number
  genre: string
  score: number
}

// Helper function to generate program_id from channel name and index
const generateProgramId = (channelName: string, index: number): string => {
  return `${channelName}_${index + 1}`;
};

interface Channel {
  id: string
  channel_id: number
  channel_name: string
  programs: Program[]
}

const GENRES = [
  "news",
  "sports",
  "music",
  "movies",
  "kids",
  "documentary",
  "drama",
  "talk",
  "entertainment",
]

export function Channels({
  items = [],
  onChange,
}: {
  items: Channel[]
  onChange: (items: Channel[]) => void
}) {
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set())

  const toggleChannel = (id: string) => {
    const newExpanded = new Set(expandedChannels)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedChannels(newExpanded)
  }

  const addChannel = () => {
    // Always use sequential channel_id starting from 0
    const channelId = items.length
    const newChannel: Channel = {
      id: Date.now().toString(),
      channel_id: channelId,
      channel_name: `Channel_${channelId}`,
      programs: [],
    }
    onChange([...items, newChannel])
    setExpandedChannels(new Set([...expandedChannels, newChannel.id]))
  }

  const removeChannel = (id: string) => {
    const newItems = items.filter((item) => item.id !== id)
    // Re-index channel_ids
    const reindexed = newItems.map((item, index) => ({
      ...item,
      channel_id: index,
    }))
    onChange(reindexed)
  }

  const updateChannel = (id: string, updates: Partial<Channel>) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  const addProgram = (channelId: string) => {
    onChange(
      items.map((item) => {
        if (item.id === channelId) {
          const newProgram: Program = {
            id: Date.now().toString(),
            start: 0,
            end: 30,
            genre: 'news',
            score: 50,
          }
          return {
            ...item,
            programs: [...item.programs, newProgram],
          }
        }
        return item
      })
    )
  }

  const removeProgram = (channelId: string, programId: string) => {
    onChange(
      items.map((item) => {
        if (item.id === channelId) {
          return {
            ...item,
            programs: item.programs.filter((p) => p.id !== programId),
          }
        }
        return item
      })
    )
  }

  const updateProgram = (channelId: string, programId: string, updates: Partial<Program>) => {
    onChange(
      items.map((item) => {
        if (item.id === channelId) {
          return {
            ...item,
            programs: item.programs.map((p) =>
              p.id === programId ? { ...p, ...updates } : p
            ),
          }
        }
        return item
      })
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Channels</h3>
            <p className="text-xs text-slate-600 mt-0.5">Manage broadcast channels and programs</p>
          </div>
          <button
            onClick={addChannel}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
          >
            <Plus size={16} />
            Add Channel
          </button>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-8">
            No channels added yet. Click "Add Channel" to create one.
          </p>
        ) : (
          items.map((channel) => {
            const isExpanded = expandedChannels.has(channel.id)
            return (
              <div
                key={channel.id}
                className="rounded-lg border border-slate-200 bg-slate-50 transition-all hover:border-slate-300"
              >
                {/* Channel Header */}
                <div className="flex gap-3 p-4">
                  <button
                    onClick={() => toggleChannel(channel.id)}
                    className="self-center rounded-lg p-1 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
                  >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  <div className="flex-1 grid grid-cols-2 gap-3 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Channel ID</label>
                      <input
                        type="number"
                        min="0"
                        value={channel.channel_id}
                        onChange={(e) => updateChannel(channel.id, { channel_id: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Channel Name</label>
                      <input
                        type="text"
                        value={channel.channel_name}
                        onChange={(e) => updateChannel(channel.id, { channel_name: e.target.value })}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-xs text-slate-600">
                        Programs: <span className="font-semibold">{channel.programs.length}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeChannel(channel.id)}
                    className="self-center rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Programs List */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">Programs</h4>
                      <button
                        onClick={() => addProgram(channel.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-green-700 active:scale-95"
                      >
                        <Plus size={14} />
                        Add Program
                      </button>
                    </div>
                    {channel.programs.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-4">
                        No programs added yet. Click "Add Program" to create one.
                      </p>
                    ) : (
                      channel.programs.map((program, progIndex) => {
                        const programId = generateProgramId(channel.channel_name, progIndex);
                        return (
                          <div
                            key={program.id}
                            className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
                          >
                            <div className="flex-1 grid grid-cols-2 gap-2 md:grid-cols-5">
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Program ID</label>
                                <div className="w-full rounded-md border border-slate-300 bg-slate-100 px-2 py-1.5 text-xs text-slate-700 font-mono">
                                  {programId}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Start (min)</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={program.start}
                                  onChange={(e) => updateProgram(channel.id, program.id, { start: parseInt(e.target.value) || 0 })}
                                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">End (min)</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={program.end}
                                  onChange={(e) => updateProgram(channel.id, program.id, { end: parseInt(e.target.value) || 0 })}
                                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Genre</label>
                                <select
                                  value={program.genre}
                                  onChange={(e) => updateProgram(channel.id, program.id, { genre: e.target.value })}
                                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                >
                                  {GENRES.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Score</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={program.score}
                                  onChange={(e) => updateProgram(channel.id, program.id, { score: parseInt(e.target.value) || 0 })}
                                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => removeProgram(channel.id, program.id)}
                              className="self-center rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
