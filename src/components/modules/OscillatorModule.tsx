import { useEffect, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { PatchNode } from '../../types/patch'
import { getAudioContext, getNode, registerNode, removeNode } from '../../audio/AudioEngine'
import { usePatchStore } from '../../store/patchStore'

const WAVE_TYPES: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle']

export function OscillatorModule({ id, data }: NodeProps<PatchNode>) {
  const audioReady = usePatchStore((s) => s.audioReady)
  const updateNodeParam = usePatchStore((s) => s.updateNodeParam)

  // Spin up the OscillatorNode when audio context is ready
  useEffect(() => {
    if (!audioReady) return
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    osc.frequency.value = data.params.frequency ?? 440
    osc.detune.value = data.params.detune ?? 0
    osc.type = WAVE_TYPES[data.params.type ?? 0]
    osc.start()
    registerNode(id, osc)
    return () => removeNode(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioReady, id])

  // Sync frequency param changes to the live audio node
  useEffect(() => {
    if (!audioReady) return
    const osc = getNode(id) as OscillatorNode | undefined
    if (!osc) return
    osc.frequency.value = data.params.frequency ?? 440
    osc.detune.value = data.params.detune ?? 0
    osc.type = WAVE_TYPES[data.params.type ?? 0]
  }, [audioReady, id, data.params.frequency, data.params.detune, data.params.type])

  const setFrequency = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updateNodeParam(id, 'frequency', Number(e.target.value)),
    [id, updateNodeParam],
  )

  const setWaveType = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      updateNodeParam(id, 'type', Number(e.target.value)),
    [id, updateNodeParam],
  )

  return (
    <div className="bg-neutral-900 border border-indigo-700 rounded-lg w-44 shadow-lg shadow-black/50">
      <div className="bg-indigo-900/60 rounded-t-lg px-3 py-1.5 text-xs font-bold text-indigo-300 tracking-widest uppercase">
        {data.label}
      </div>

      {/* FM CV input */}
      <Handle
        id="fm"
        type="target"
        position={Position.Left}
        style={{ top: '50%' }}
        title="FM input (CV)"
      />

      <div className="p-3 space-y-3">
        <div>
          <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
            Freq {data.params.frequency} Hz
          </label>
          <input
            type="range"
            min={20}
            max={20000}
            step={1}
            value={data.params.frequency}
            onChange={setFrequency}
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
            Waveform
          </label>
          <select
            value={data.params.type}
            onChange={setWaveType}
            className="w-full mt-1 bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded px-2 py-1"
          >
            {WAVE_TYPES.map((t, i) => (
              <option key={t} value={i}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audio output */}
      <Handle
        id="out"
        type="source"
        position={Position.Right}
        style={{ top: '50%' }}
        title="Audio output"
      />
    </div>
  )
}
