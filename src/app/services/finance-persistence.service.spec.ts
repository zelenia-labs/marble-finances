import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { FinancePersistenceService } from './finance-persistence.service';
import { ImportedPortfolio } from '../store/finance.store';

describe('FinancePersistenceService', () => {
  let service: FinancePersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancePersistenceService],
    });
    service = TestBed.inject(FinancePersistenceService);
  });

  describe('isValidImportedPortfolio', () => {
    it('should return true for a valid portfolio', () => {
      const validData: ImportedPortfolio = {
        months: [
          {
            id: 'month_1',
            date: 'January 2026',
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [
              {
                id: 'flow_1',
                label: 'Salary',
                val: 5000,
                color: 'blue',
                type: 'salary',
                parentCategory: 'savings',
              },
            ],
            assetCategories: [
              {
                id: 'cat_1',
                label: 'Cash',
                color: 'blue',
                assets: [
                  {
                    id: 'asset_1',
                    label: 'Bank Account',
                    val: 10000,
                    note: 'Checking',
                  },
                ],
              },
            ],
            actionItems: [
              {
                id: 'todo_1',
                label: 'Pay bills',
                completed: false,
              },
            ],
          },
        ],
        marbleMultiplier: 1000,
        customColors: ['#FF5733'],
      };

      expect(service.isValidImportedPortfolio(validData)).toBe(true);
    });

    it('should return false if months is missing or not an array', () => {
      const invalidData = {
        marbleMultiplier: 1000,
      };
      expect(service.isValidImportedPortfolio(invalidData)).toBe(false);
      expect(service.isValidImportedPortfolio({ months: {} })).toBe(false);
    });

    it('should return false if required month fields are missing or wrong type', () => {
      const invalidData = {
        months: [
          {
            id: 'month_1',
            // missing date
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [],
            assetCategories: [],
            actionItems: [],
          },
        ],
      };
      expect(service.isValidImportedPortfolio(invalidData)).toBe(false);

      const invalidType = {
        months: [
          {
            id: 'month_1',
            date: 12345 as unknown as string, // should be string
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [],
            assetCategories: [],
            actionItems: [],
          },
        ],
      };
      expect(service.isValidImportedPortfolio(invalidType)).toBe(false);
    });

    it('should return false if flow item structure is invalid', () => {
      const invalidFlow = {
        months: [
          {
            id: 'month_1',
            date: 'January 2026',
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [
              {
                id: 'flow_1',
                label: 'Salary',
                val: 'five thousand' as unknown as number, // should be number
                color: 'blue',
                type: 'salary',
                parentCategory: 'savings',
              },
            ],
            assetCategories: [],
            actionItems: [],
          },
        ],
      };
      expect(service.isValidImportedPortfolio(invalidFlow)).toBe(false);
    });

    it('should return false if parentCategory in flow item is invalid', () => {
      const invalidCategory = {
        months: [
          {
            id: 'month_1',
            date: 'January 2026',
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [
              {
                id: 'flow_1',
                label: 'Salary',
                val: 5000,
                color: 'blue',
                type: 'salary',
                parentCategory: 'invalid-category', // must be expense or savings
              },
            ],
            assetCategories: [],
            actionItems: [],
          },
        ],
      };
      expect(service.isValidImportedPortfolio(invalidCategory)).toBe(false);
    });

    it('should return false if asset item structure is invalid', () => {
      const invalidAsset = {
        months: [
          {
            id: 'month_1',
            date: 'January 2026',
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [],
            assetCategories: [
              {
                id: 'cat_1',
                label: 'Cash',
                color: 'blue',
                assets: [
                  {
                    id: 'asset_1',
                    label: 'Bank Account',
                    val: 10000,
                    note: 12345 as unknown as string, // should be string or null/undefined
                  },
                ],
              },
            ],
            actionItems: [],
          },
        ],
      };
      expect(service.isValidImportedPortfolio(invalidAsset)).toBe(false);
    });

    it('should return false if customColors contains non-strings', () => {
      const invalidColors = {
        months: [],
        customColors: [123 as unknown as string],
      };
      expect(service.isValidImportedPortfolio(invalidColors)).toBe(false);
    });
  });

  describe('localStorage and file import validation behavior', () => {
    let mockLocalStorage: Record<string, string> = {};

    beforeEach(() => {
      mockLocalStorage = {};
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => mockLocalStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockLocalStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockLocalStorage[key];
        },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should load main state if it is valid', () => {
      const validState = {
        months: [
          {
            id: 'month_1',
            date: 'January 2026',
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [],
            assetCategories: [],
            actionItems: [],
          },
        ],
        marbleMultiplier: 1000,
      };

      localStorage.setItem('marble_finance_multi_data', JSON.stringify(validState));
      const loaded = service.loadMainState();
      expect(loaded).not.toBeNull();
      expect((loaded as ImportedPortfolio).months.length).toBe(1);
    });

    it('should return null on loadMainState if storage contents fail verification', () => {
      const invalidState = {
        months: [
          {
            id: 'month_1',
            // missing date
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [],
            assetCategories: [],
            actionItems: [],
          },
        ],
      };

      localStorage.setItem('marble_finance_multi_data', JSON.stringify(invalidState));
      const loaded = service.loadMainState();
      expect(loaded).toBeNull();
    });

    it('should validate imported file text successfully if shape is valid', async () => {
      const validFileContent = JSON.stringify({
        months: [
          {
            id: 'month_1',
            date: 'January 2026',
            grossAnnual: '100000',
            netAnnual: '80000',
            netMonthly: '6666',
            flow: [],
            assetCategories: [],
            actionItems: [],
          },
        ],
      });

      const file = new File([validFileContent], 'portfolio.json', { type: 'application/json' });
      const parsed = await service.importData(file);
      expect(parsed).not.toBeNull();
      expect((parsed as ImportedPortfolio).months).toBeDefined();
    });

    it('should reject file contents and trigger warn/alert if shape is invalid', async () => {
      const invalidFileContent = JSON.stringify({
        months: [
          {
            id: 'month_1',
            // missing date
            grossAnnual: '100000',
          },
        ],
      });

      // Stub window.alert to prevent blocking test run
      const alertSpy = vi.fn();
      vi.stubGlobal('alert', alertSpy);

      const file = new File([invalidFileContent], 'portfolio.json', { type: 'application/json' });
      const parsed = await service.importData(file);
      expect(parsed).toBeNull();
    });
  });
});
