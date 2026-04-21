/**
 * Singleton AudioContext manager.
 * Must be resumed inside a user gesture (required by browsers + iOS).
 */

let audioContext: AudioContext | null = null
// Tracks all live AudioNodes by a stable ID
const audioNodes = new Map<string, AudioNode>()

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export async function resumeAudio(): Promise<void> {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
}

export function getNode(id: string): AudioNode | undefined {
  return audioNodes.get(id)
}

export function registerNode(id: string, node: AudioNode): void {
  audioNodes.set(id, node)
}

export function removeNode(id: string): void {
  const node = audioNodes.get(id)
  if (node) {
    // Disconnect all connections before removing
    try { node.disconnect() } catch (_) { /* already disconnected */ }
    audioNodes.delete(id)
  }
}

export function connectNodes(
  sourceId: string,
  destId: string,
  destParamName?: string,
): void {
  const src = audioNodes.get(sourceId)
  const dst = audioNodes.get(destId)
  if (!src || !dst) return

  if (destParamName && 'parameters' in dst) {
    const param = (dst as AudioWorkletNode).parameters.get(destParamName)
    if (param) {
      ;(src as AudioNode).connect(param)
      return
    }
  }
  // Also support connecting to AudioParams on built-in nodes (e.g. BiquadFilter.frequency)
  if (destParamName && destParamName in dst) {
    const param = (dst as unknown as Record<string, AudioParam>)[destParamName]
    if (param instanceof AudioParam) {
      ;(src as AudioNode).connect(param)
      return
    }
  }
  src.connect(dst as AudioNode)
}

export function disconnectNodes(
  sourceId: string,
  destId: string,
): void {
  const src = audioNodes.get(sourceId)
  const dst = audioNodes.get(destId)
  if (!src || !dst) return
  try { src.disconnect(dst as AudioNode) } catch (_) { /* already disconnected */ }
}
