import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'
import type { PatchNode, PatchEdge } from '../types/patch'
import { connectNodes, disconnectNodes } from '../audio/AudioEngine'

interface PatchState {
  nodes: PatchNode[]
  edges: PatchEdge[]
  audioReady: boolean

  setAudioReady: (ready: boolean) => void
  onNodesChange: (changes: NodeChange<PatchNode>[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  updateNodeParam: (nodeId: string, param: string, value: number) => void
}

export const usePatchStore = create<PatchState>((set, get) => ({
  nodes: [],
  edges: [],
  audioReady: false,

  setAudioReady: (ready) => set({ audioReady: ready }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) => {
    // Disconnect audio when an edge is removed
    for (const change of changes) {
      if (change.type === 'remove') {
        const edge = get().edges.find((e) => e.id === change.id)
        if (edge) {
          disconnectNodes(edge.source, edge.target)
        }
      }
    }
    set({ edges: applyEdgeChanges(changes, get().edges) })
  },

  onConnect: (connection) => {
    const { source, target, sourceHandle, targetHandle } = connection
    if (!source || !target) return

    const newEdge: PatchEdge = {
      id: `${source}:${sourceHandle ?? 'out'}->${target}:${targetHandle ?? 'in'}`,
      source,
      target,
      sourceHandle: sourceHandle ?? null,
      targetHandle: targetHandle ?? null,
    }

    // Wire up the audio graph — targetHandle encodes the param name for CV connections
    connectNodes(source, target, targetHandle ?? undefined)

    set({ edges: [...get().edges, newEdge] })
  },

  updateNodeParam: (nodeId, param, value) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, params: { ...n.data.params, [param]: value } } }
          : n,
      ),
    }),
}))
