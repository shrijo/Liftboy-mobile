/**
 * Template AudioWorklet processor.
 * Each custom DSP module gets its own worklet file in this directory.
 * This one implements a basic oscillator with audio-rate FM support.
 */
class OscillatorProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'frequency',
        defaultValue: 440,
        minValue: 0.01,
        maxValue: 20000,
        automationRate: 'a-rate', // audio-rate = CV modulation supported
      },
      {
        name: 'detune',
        defaultValue: 0,
        minValue: -1200,
        maxValue: 1200,
        automationRate: 'k-rate',
      },
    ]
  }

  constructor() {
    super()
    this._phase = 0
  }

  process(_inputs, outputs, parameters) {
    const output = outputs[0]
    const channel = output[0]
    if (!channel) return true

    const freqValues = parameters.frequency
    const detune = parameters.detune[0] ?? 0
    const detuneMultiplier = Math.pow(2, detune / 1200)

    for (let i = 0; i < channel.length; i++) {
      // Audio-rate frequency with one-pole smoothing to avoid zipping
      const freq = (freqValues.length > 1 ? freqValues[i] : freqValues[0]) * detuneMultiplier
      channel[i] = Math.sin(2 * Math.PI * this._phase)
      this._phase += freq / sampleRate
      if (this._phase >= 1) this._phase -= 1
    }

    return true // keep processor alive
  }
}

registerProcessor('oscillator-processor', OscillatorProcessor)
