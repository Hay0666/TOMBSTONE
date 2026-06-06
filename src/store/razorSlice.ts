/**
 * TOMBSTONE — Razor Slice
 * Zustand state for the Deprecation Razor interaction system.
 */

import type { StateCreator } from 'zustand'
import type { RazorMode, Point } from '@/types'

export interface RazorSlice {
  razorMode: RazorMode
  razorPath: Point[]
  razorCursor: Point
  targetedNodeIds: string[]
  lastSentencedIds: string[]

  // Actions
  armRazor: () => void
  disarmRazor: () => void
  startRazorPath: (point: Point) => void
  addPointToRazorPath: (point: Point) => void
  updateRazorCursor: (point: Point) => void
  setTargetedNodes: (ids: string[]) => void
  executeRazor: () => void
  resetRazor: () => void
  setLastSentenced: (ids: string[]) => void
}

export const createRazorSlice: StateCreator<RazorSlice, [], [], RazorSlice> = (set) => ({
  razorMode: 'NOMINAL',
  razorPath: [],
  razorCursor: { x: 0, y: 0 },
  targetedNodeIds: [],
  lastSentencedIds: [],

  armRazor: () => set({
    razorMode: 'RAZOR_ARMED',
    razorPath: [],
    targetedNodeIds: [],
  }),

  disarmRazor: () => set({
    razorMode: 'NOMINAL',
    razorPath: [],
    targetedNodeIds: [],
  }),

  startRazorPath: (point) => set({
    razorMode: 'DRAWING',
    razorPath: [point],
  }),

  addPointToRazorPath: (point) => set(state => ({
    razorPath: [...state.razorPath, point],
  })),

  updateRazorCursor: (point) => set({
    razorCursor: point,
  }),

  setTargetedNodes: (ids) => set({
    targetedNodeIds: ids,
  }),

  executeRazor: () => set({
    razorMode: 'EXECUTING',
  }),

  resetRazor: () => set({
    razorMode: 'NOMINAL',
    razorPath: [],
    targetedNodeIds: [],
  }),

  setLastSentenced: (ids) => set({
    lastSentencedIds: ids,
  }),
})
