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

const nodeTypes: NodeTypes = {
  oscillator: OscillatorModule,
}

export function PatchCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = usePatchStore()

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
