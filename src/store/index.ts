/**
 * TOMBSTONE — Composed Zustand Store
 * Single store combining all slices.
 */

import { create } from 'zustand'
import { createGraphSlice, type GraphSlice } from './graphSlice'
import { createRazorSlice, type RazorSlice } from './razorSlice'
import { createUISlice, type UISlice } from './uiSlice'

export type AppStore = GraphSlice & RazorSlice & UISlice

export const useStore = create<AppStore>()((...args) => ({
  ...createGraphSlice(...args),
  ...createRazorSlice(...args),
  ...createUISlice(...args),
}))
