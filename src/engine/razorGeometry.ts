/**
 * TOMBSTONE — Razor Geometry Engine
 * Pure geometric intersection calculations for the Deprecation Razor.
 * No React imports. No side effects.
 */

import type { Point } from '@/types'

/**
 * Calculate the shortest distance from a point to a line segment.
 * Used to determine if a node's center is within its radius of the cut line.
 */
export function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy

  // Degenerate case: line segment is a point
  if (lengthSquared === 0) {
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
  }

  // Project point onto line, clamped to [0, 1] to stay within segment
  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared
  t = Math.max(0, Math.min(1, t))

  // Closest point on segment
  const closestX = x1 + t * dx
  const closestY = y1 + t * dy

  return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2)
}

interface NodeBounds {
  id: string
  x: number  // center x (absolute canvas position)
  y: number  // center y (absolute canvas position)
  radius: number
}

/**
 * Get IDs of all nodes whose collision zone intersects the cut vector.
 * A node is intersected if its center-to-segment distance < its radius.
 */
export function getIntersectedNodes(
  origin: Point,
  endpoint: Point,
  nodes: NodeBounds[],
): string[] {
  const intersected: string[] = []

  for (const node of nodes) {
    const distance = pointToSegmentDistance(
      node.x,
      node.y,
      origin.x,
      origin.y,
      endpoint.x,
      endpoint.y,
    )

    if (distance < node.radius) {
      intersected.push(node.id)
    }
  }

  return intersected
}

/**
 * Compute the projected intersection point of the blade line with a node's radius.
 * Used for visual effects (blade flash position per node).
 */
export function getClosestPointOnSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): Point {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy

  if (lengthSquared === 0) return { x: x1, y: y1 }

  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared
  t = Math.max(0, Math.min(1, t))

  return {
    x: x1 + t * dx,
    y: y1 + t * dy,
  }
}

/**
 * Get IDs of all nodes whose collision zone intersects a multi-segment path.
 */
export function getIntersectedNodesPolyline(
  path: Point[],
  nodes: NodeBounds[],
): string[] {
  const intersected = new Set<string>()

  for (let i = 0; i < path.length - 1; i++) {
    const origin = path[i]
    const endpoint = path[i + 1]
    const segmentIntersected = getIntersectedNodes(origin, endpoint, nodes)
    for (const id of segmentIntersected) {
      intersected.add(id)
    }
  }

  return Array.from(intersected)
}
