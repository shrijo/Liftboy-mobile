import { useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { PatchCanvas, createModuleNode } from './components/canvas/PatchCanvas'
import { usePatchStore } from './store/patchStore'
import { useAudioResume } from './hooks/useAudioResume'

function Toolbar() {
  const nodes = usePatchStore((s) => s.nodes)
  const audioReady = usePatchStore((s) => s.audioReady)

  const addOscillator = useCallback(() => {
    const node = createModuleNode('oscillator', {
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
    })
    usePatchStore.setState((s) => ({ nodes: [...s.nodes, node] }))
  }, [])

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-neutral-950 border-b border-neutral-800 shrink-0">
      <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase">
        Liftboy
      </span>
      <div className="w-px h-4 bg-neutral-700" />
      <button
        onClick={addOscillator}
        className="text-xs px-3 py-1 bg-indigo-800 hover:bg-indigo-700 rounded text-indigo-100 transition-colors"
      >
        + Oscillator
      </button>
      <div className="ml-auto flex items-center gap-2">
        {!audioReady && (
          <span className="text-xs text-amber-400 animate-pulse">
            Click anywhere to enable audio
          </span>
        )}
        {audioReady && (
          <span className="text-xs text-green-500">● Audio ready</span>
        )}
        <span className="text-xs text-neutral-500">{nodes.length} modules</span>
      </div>
    </div>
  )
}

export default function App() {
  useAudioResume()

  return (
    <div className="flex flex-col w-full h-full">
      <ReactFlowProvider>
        <Toolbar />
        <div className="flex-1 min-h-0">
          <PatchCanvas />
        </div>
      </ReactFlowProvider>
    </div>
  )
}
