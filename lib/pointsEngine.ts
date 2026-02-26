/**
 * Points Engine — Calculates points based on correctness + speed
 *
 * Speed multiplier tiers (fraction of time REMAINING):
 *  > 75% remaining  → 2.0x  (blazing fast)
 *  50–75% remaining → 1.5x  (fast)
 *  25–50% remaining → 1.25x (normal)
 *  <  25% remaining → 1.0x  (slow but still correct)
 */

export interface PointsResult {
  base: number
  multiplier: number
  bonus: number
  total: number
  tier: 'blazing' | 'fast' | 'normal' | 'slow'
}

export function calculatePoints(
  basePoints: number,
  timeLimit: number,   // seconds
  timeUsedMs: number,  // milliseconds actually used
  correct: boolean,
  speedBonus: boolean
): PointsResult {
  if (!correct) return { base: basePoints, multiplier: 0, bonus: 0, total: 0, tier: 'slow' }

  const timeLimitMs = timeLimit * 1000
  const fractionRemaining = Math.max(0, (timeLimitMs - timeUsedMs) / timeLimitMs)

  let multiplier = 1.0
  let tier: PointsResult['tier'] = 'slow'

  if (speedBonus) {
    if (fractionRemaining > 0.75) { multiplier = 2.0; tier = 'blazing' }
    else if (fractionRemaining > 0.5) { multiplier = 1.5; tier = 'fast' }
    else if (fractionRemaining > 0.25) { multiplier = 1.25; tier = 'normal' }
    else { multiplier = 1.0; tier = 'slow' }
  }

  const total = Math.round(basePoints * multiplier)
  const bonus = total - basePoints

  return { base: basePoints, multiplier, bonus, total, tier }
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function getMaxPlayersForMode(mode: string): number {
  return { solo: 1, '1v1': 2, '2v2': 4, '4v4': 8 }[mode] ?? 1
}

export function assignTeam(playerIndex: number, mode: string): 'A' | 'B' {
  if (mode === 'solo' || mode === '1v1') {
    return playerIndex === 0 ? 'A' : 'B'
  }
  if (mode === '2v2') {
    return playerIndex < 2 ? 'A' : 'B'
  }
  // 4v4
  return playerIndex < 4 ? 'A' : 'B'
}
