'use client'

import { Plus, Trash2 } from 'lucide-react'

interface PriorityBlock {
  id: string
  name: string
  start: number
  end: number
  allowed_channels: number[]
}

export function PriorityBlocks({
  items = [],
  onChange,
}: {
  items: PriorityBlock[]
  onChange: (items: PriorityBlock[]) => void
}) {
  const addItem = () => {
    const newItem: PriorityBlock = {
      id: Date.now().toString(),
      name: 'Block 1',
      start: 420,
      end: 600,
      allowed_channels: [0],
    }
    onChange([...items, newItem])
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, updates: Partial<PriorityBlock>) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Priority Blocks</h3>
            <p className="text-xs text-slate-600 mt-0.5">Define priority time blocks</p>
          </div>
          <button
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-8">
            No priority blocks added yet. Click "Add" to create one.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:bg-slate-100/50"
            >
              <div className="flex-1 grid grid-cols-2 gap-3 md:grid-cols-4">

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full rounded-md border px-2 py-2 text-sm"
                  />
                </div>

                {/* Start */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start (min)</label>
                  <input
                    type="number"
                    value={item.start}
                    onChange={(e) => updateItem(item.id, { start: Number(e.target.value) })}
                    className="w-full rounded-md border px-2 py-2 text-sm"
                  />
                </div>

                {/* End */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End (min)</label>
                  <input
                    type="number"
                    value={item.end}
                    onChange={(e) => updateItem(item.id, { end: Number(e.target.value) })}
                    className="w-full rounded-md border px-2 py-2 text-sm"
                  />
                </div>

                {/* Allowed Channels */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Allowed Channels (comma separated)
                  </label>
                  <input
                    type="text"
                    value={item.allowed_channels.join(',')}
                    onChange={(e) =>
                      updateItem(item.id, {
                        allowed_channels: e.target.value
                          .split(',')
                          .map((v) => Number(v.trim()))
                          .filter((n) => !isNaN(n)),
                      })
                    }
                    className="w-full rounded-md border px-2 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="self-center rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
