import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { usePatchStore } from '../../store/patchStore'
import { OscillatorModule } from '../modules/OscillatorModule'
import type { ModuleData, ModuleType, PatchNode } from '../../types/patch'

const nodeTypes: NodeTypes = {
  oscillator: OscillatorModule,
}

export function PatchCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = usePatchStore()

  const handleInit = useCallback(() => {
    // AudioContext is started on user gesture via useAudioResume hook
  }, [])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={handleInit}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        minZoom={0.3}
        maxZoom={2}
        deleteKeyCode="Backspace"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1e1e2e"
        />
        <Controls className="!bg-neutral-900 !border-neutral-700 !text-neutral-300" />
        <MiniMap
          className="!bg-neutral-900 !border-neutral-700"
          nodeColor="#6366f1"
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  )
}

const MODULE_DEFAULTS: Record<ModuleType, Omit<ModuleData, 'moduleType'>> = {
  oscillator: {
    label: 'Oscillator',
    inputs: [{ id: 'fm', label: 'FM', type: 'cv' }],
    outputs: [{ id: 'out', label: 'Out', type: 'audio' }],
    params: { frequency: 440, detune: 0, type: 0 },
  },
  filter: {
    label: 'Filter',
    inputs: [
      { id: 'in', label: 'In', type: 'audio' },
      { id: 'cutoff-cv', label: 'Cutoff CV', type: 'cv' },
    ],
    outputs: [{ id: 'out', label: 'Out', type: 'audio' }],
    params: { frequency: 1000, Q: 1, type: 0 },
  },
  envelope: {
    label: 'Envelope',
    inputs: [{ id: 'gate', label: 'Gate', type: 'gate' }],
    outputs: [{ id: 'cv', label: 'CV', type: 'cv' }],
    params: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.3 },
  },
  vca: {
    label: 'VCA',
    inputs: [
      { id: 'in', label: 'In', type: 'audio' },
      { id: 'cv', label: 'CV', type: 'cv' },
    ],
    outputs: [{ id: 'out', label: 'Out', type: 'audio' }],
    params: { gain: 1 },
  },
  lfo: {
    label: 'LFO',
    inputs: [],
    outputs: [{ id: 'cv', label: 'CV', type: 'cv' }],
    params: { frequency: 1, depth: 1, type: 0 },
  },
  clock: {
    label: 'Clock',
    inputs: [],
    outputs: [{ id: 'trigger', label: 'Trigger', type: 'trigger' }],
    params: { bpm: 120, division: 1 },
  },
  sequencer: {
    label: 'Sequencer',
    inputs: [{ id: 'clock', label: 'Clock', type: 'trigger' }],
    outputs: [
      { id: 'cv', label: 'CV', type: 'cv' },
      { id: 'gate', label: 'Gate', type: 'gate' },
    ],
    params: { steps: 8, currentStep: 0 },
  },
  output: {
    label: 'Output',
    inputs: [
      { id: 'left', label: 'L', type: 'audio' },
      { id: 'right', label: 'R', type: 'audio' },
    ],
    outputs: [],
    params: { gain: 1 },
  },
}

export function createModuleNode(
  type: ModuleType,
  position = { x: 100, y: 100 },
): PatchNode {
  const id = `${type}-${Date.now()}`
  const defaults = MODULE_DEFAULTS[type]
  return {
    id,
    type,
    position,
    data: { moduleType: type, ...defaults } as ModuleData,
  }
}
