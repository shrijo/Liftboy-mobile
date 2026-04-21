import type { Node, Edge } from '@xyflow/react'

export type ModuleType =
  | 'oscillator'
  | 'filter'
  | 'envelope'
  | 'vca'
  | 'lfo'
  | 'clock'
  | 'sequencer'
  | 'output'

export interface PortDefinition {
  id: string
  label: string
  type: 'audio' | 'cv' | 'gate' | 'trigger'
}

// Extends Record<string, unknown> to satisfy React Flow's node data constraint
export interface ModuleData extends Record<string, unknown> {
  moduleType: ModuleType
  label: string
  inputs: PortDefinition[]
  outputs: PortDefinition[]
  params: Record<string, number>
  audioNodeId?: string
}

export type PatchNode = Node<ModuleData>
export type PatchEdge = Edge
