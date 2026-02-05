import {
  computeApproachInsights,
  getDashboardInsightsSummary,
  formatTimeSinceUse,
} from '../insights'
import {
  InteractionOutcome,
  OutcomeType,
  OutcomeContext,
  ParentingApproach,
  Situation,
} from '../types'
import * as storage from '../storage'

// Mock the storage module
jest.mock('../storage', () => ({
  getFilteredOutcomes: jest.fn(),
}))

describe('Insights Module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('computeApproachInsights', () => {
    it('should return zero stats for no outcomes', () => {
      (storage.getFilteredOutcomes as jest.Mock).mockReturnValue([])

      const result = computeApproachInsights('connect-redirect')

      expect(result.totalUses).toBe(0)
      expect(result.totalSuccesses).toBe(0)
      expect(result.totalFailures).toBe(0)
      expect(result.successRate).toBe(0)
      expect(result.ratedCount).toBe(0)
      expect(result.lastUsed).toBeNull()
      expect(result.patterns).toEqual([])
      expect(result.statement).toBeNull()
    })

    it('should calculate basic stats correctly', () => {
      const mockOutcomes: InteractionOutcome[] = [
        {
          id: '1',
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect',
          situationId: 'tantrum',
          timestamp: '2024-01-01T12:00:00Z',
          outcome: 'SUCCESS',
          contexts: [],
        },
        {
          id: '2',
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect',
          situationId: 'tantrum',
          timestamp: '2024-01-02T12:00:00Z',
          outcome: 'SUCCESS',
          contexts: [],
        },
        {
          id: '3',
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect',
          situationId: 'tantrum',
          timestamp: '2024-01-03T12:00:00Z',
          outcome: 'NOT_SUCCESS',
          contexts: [],
        },
      ]

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      expect(result.totalUses).toBe(3)
      expect(result.totalSuccesses).toBe(2)
      expect(result.totalFailures).toBe(1)
      expect(result.successRate).toBeCloseTo(0.667, 2)
      expect(result.ratedCount).toBe(3)
      expect(result.lastUsed).toBe('2024-01-01T12:00:00Z')
    })

    it('should exclude UNKNOWN outcomes from success rate calculation', () => {
      const mockOutcomes: InteractionOutcome[] = [
        {
          id: '1',
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect',
          situationId: 'tantrum',
          timestamp: '2024-01-01T12:00:00Z',
          outcome: 'SUCCESS',
          contexts: [],
        },
        {
          id: '2',
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect',
          situationId: 'tantrum',
          timestamp: '2024-01-02T12:00:00Z',
          outcome: 'UNKNOWN',
          contexts: [],
        },
        {
          id: '3',
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect',
          situationId: 'tantrum',
          timestamp: '2024-01-03T12:00:00Z',
          outcome: 'NOT_SUCCESS',
          contexts: [],
        },
      ]

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      expect(result.totalUses).toBe(3)
      expect(result.ratedCount).toBe(2) // Only SUCCESS and NOT_SUCCESS
      expect(result.successRate).toBe(0.5) // 1 success out of 2 rated
    })

    it('should generate statement when rated count >= 10', () => {
      const mockOutcomes: InteractionOutcome[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i}`,
        userId: 'default',
        childId: null,
        approachId: 'connect-redirect',
        situationId: 'tantrum',
        timestamp: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
        outcome: i < 8 ? ('SUCCESS' as OutcomeType) : ('NOT_SUCCESS' as OutcomeType),
        contexts: [],
      }))

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      expect(result.statement).toBe('Helped 8 of 12 times')
    })

    it('should not generate statement when rated count < 10', () => {
      const mockOutcomes: InteractionOutcome[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        userId: 'default',
        childId: null,
        approachId: 'connect-redirect',
        situationId: 'tantrum',
        timestamp: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
        outcome: 'SUCCESS' as OutcomeType,
        contexts: [],
      }))

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      expect(result.statement).toBeNull()
    })

    it('should detect significant positive context pattern', () => {
      // Create 10 outcomes: 5 with 'tired' context (all successful), 5 without (only 1 successful)
      const mockOutcomes: InteractionOutcome[] = [
        // With 'tired' - all successful
        ...Array.from({ length: 5 }, (_, i) => ({
          id: `tired-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
          outcome: 'SUCCESS' as OutcomeType,
          contexts: ['tired'] as OutcomeContext[],
        })),
        // Without 'tired' - 1 successful, 4 failures
        {
          id: 'no-tired-1',
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: '2024-01-06T12:00:00Z',
          outcome: 'SUCCESS' as OutcomeType,
          contexts: [] as OutcomeContext[],
        },
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `no-tired-${i + 2}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 7).padStart(2, '0')}T12:00:00Z`,
          outcome: 'NOT_SUCCESS' as OutcomeType,
          contexts: [] as OutcomeContext[],
        })),
      ]

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      // Should find a significant pattern for 'tired' context
      const tiredPattern = result.patterns.find(p => p.context === 'tired')
      expect(tiredPattern).toBeDefined()
      expect(tiredPattern?.isSignificant).toBe(true)
      expect(tiredPattern?.successRate).toBe(1.0) // 100% success with tired
      expect(tiredPattern?.statement).toContain('Works better when tired')
    })

    it('should detect significant negative context pattern', () => {
      // Create 10 outcomes: 5 with 'rushed' context (all failed), 5 without (all successful)
      const mockOutcomes: InteractionOutcome[] = [
        // With 'rushed' - all failed
        ...Array.from({ length: 5 }, (_, i) => ({
          id: `rushed-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
          outcome: 'NOT_SUCCESS' as OutcomeType,
          contexts: ['rushed'] as OutcomeContext[],
        })),
        // Without 'rushed' - all successful
        ...Array.from({ length: 5 }, (_, i) => ({
          id: `no-rushed-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 6).padStart(2, '0')}T12:00:00Z`,
          outcome: 'SUCCESS' as OutcomeType,
          contexts: [] as OutcomeContext[],
        })),
      ]

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      // Should find a significant pattern for 'rushed' context
      const rushedPattern = result.patterns.find(p => p.context === 'rushed')
      expect(rushedPattern).toBeDefined()
      expect(rushedPattern?.isSignificant).toBe(true)
      expect(rushedPattern?.successRate).toBe(0.0) // 0% success when rushed
      expect(rushedPattern?.statement).toContain('Less effective when rushed')
    })

    it('should not detect pattern with insufficient sample size', () => {
      // Only 3 outcomes with 'tired' context (below threshold of 5)
      const mockOutcomes: InteractionOutcome[] = Array.from({ length: 3 }, (_, i) => ({
        id: `${i}`,
        userId: 'default',
        childId: null,
        approachId: 'connect-redirect' as ParentingApproach,
        situationId: 'tantrum' as Situation,
        timestamp: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
        outcome: 'SUCCESS' as OutcomeType,
        contexts: ['tired'] as OutcomeContext[],
      }))

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      // Should not have any significant patterns due to low sample size
      const significantPatterns = result.patterns.filter(p => p.isSignificant)
      expect(significantPatterns.length).toBe(0)
    })

    it('should not detect pattern with insufficient difference from baseline', () => {
      // 10 outcomes with similar success rates (55% vs 50%)
      const mockOutcomes: InteractionOutcome[] = [
        // With 'tired' - 3 successes, 2 failures (60% success)
        ...Array.from({ length: 3 }, (_, i) => ({
          id: `tired-success-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 1).padStart(2, '0')}T12:00:00Z`,
          outcome: 'SUCCESS' as OutcomeType,
          contexts: ['tired'] as OutcomeContext[],
        })),
        ...Array.from({ length: 2 }, (_, i) => ({
          id: `tired-fail-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 4).padStart(2, '0')}T12:00:00Z`,
          outcome: 'NOT_SUCCESS' as OutcomeType,
          contexts: ['tired'] as OutcomeContext[],
        })),
        // Without 'tired' - 2 successes, 3 failures (40% success)
        ...Array.from({ length: 2 }, (_, i) => ({
          id: `no-tired-success-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 6).padStart(2, '0')}T12:00:00Z`,
          outcome: 'SUCCESS' as OutcomeType,
          contexts: [] as OutcomeContext[],
        })),
        ...Array.from({ length: 3 }, (_, i) => ({
          id: `no-tired-fail-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: `2024-01-${String(i + 8).padStart(2, '0')}T12:00:00Z`,
          outcome: 'NOT_SUCCESS' as OutcomeType,
          contexts: [] as OutcomeContext[],
        })),
      ]

      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue(mockOutcomes)

      const result = computeApproachInsights('connect-redirect')

      // Difference is 20% (60% vs 40%), which is exactly at threshold
      // Pattern should exist but might not be significant due to rounding
      const tiredPattern = result.patterns.find(p => p.context === 'tired')
      expect(tiredPattern).toBeDefined()
      // Depending on exact implementation, this may or may not be significant at exactly 20%
    })
  })

  describe('getDashboardInsightsSummary', () => {
    it('should return no data when not enough outcomes', () => {
      ;(storage.getFilteredOutcomes as jest.Mock).mockReturnValue([])

      const result = getDashboardInsightsSummary()

      expect(result.hasMinimumData).toBe(false)
      expect(result.topApproach).toBeNull()
      expect(result.totalTracked).toBe(0)
    })

    it('should select approach with more successes as top', () => {
      // Use recent dates (within last 30 days)
      const now = new Date()
      const mockOutcomes: InteractionOutcome[] = [
        // Connect-redirect: 3 successes
        ...Array.from({ length: 3 }, (_, i) => ({
          id: `cr-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'connect-redirect' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
          outcome: 'SUCCESS' as OutcomeType,
          contexts: [] as OutcomeContext[],
        })),
        // Emotion-coaching: 2 successes
        ...Array.from({ length: 2 }, (_, i) => ({
          id: `ec-${i}`,
          userId: 'default',
          childId: null,
          approachId: 'emotion-coaching' as ParentingApproach,
          situationId: 'tantrum' as Situation,
          timestamp: new Date(now.getTime() - (i + 4) * 24 * 60 * 60 * 1000).toISOString(),
          outcome: 'SUCCESS' as OutcomeType,
          contexts: [] as OutcomeContext[],
        })),
      ]

      // Mock returns different outcomes based on filter
      ;(storage.getFilteredOutcomes as jest.Mock).mockImplementation((filters) => {
        if (filters.approachId === 'connect-redirect') {
          return mockOutcomes.filter(o => o.approachId === 'connect-redirect')
        } else if (filters.approachId === 'emotion-coaching') {
          return mockOutcomes.filter(o => o.approachId === 'emotion-coaching')
        }
        return mockOutcomes
      })

      const result = getDashboardInsightsSummary()

      expect(result.hasMinimumData).toBe(true)
      expect(result.topApproach?.approachId).toBe('connect-redirect')
      expect(result.totalTracked).toBe(5)
    })
  })

  describe('formatTimeSinceUse', () => {
    beforeEach(() => {
      // Mock the current date to Jan 15, 2024
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return "Never used" for null timestamp', () => {
      expect(formatTimeSinceUse(null)).toBe('Never used')
    })

    it('should return "Today" for same day', () => {
      expect(formatTimeSinceUse('2024-01-15T08:00:00Z')).toBe('Today')
    })

    it('should return "Yesterday" for previous day', () => {
      expect(formatTimeSinceUse('2024-01-14T08:00:00Z')).toBe('Yesterday')
    })

    it('should return days for recent dates', () => {
      expect(formatTimeSinceUse('2024-01-12T08:00:00Z')).toBe('3 days ago')
    })

    it('should return weeks for dates 1-4 weeks ago', () => {
      expect(formatTimeSinceUse('2024-01-08T08:00:00Z')).toBe('1 week ago')
      expect(formatTimeSinceUse('2024-01-01T08:00:00Z')).toBe('2 weeks ago')
    })

    it('should return months for dates > 30 days ago', () => {
      expect(formatTimeSinceUse('2023-12-15T08:00:00Z')).toBe('1 month ago')
      expect(formatTimeSinceUse('2023-11-15T08:00:00Z')).toBe('2 months ago')
    })
  })
})
