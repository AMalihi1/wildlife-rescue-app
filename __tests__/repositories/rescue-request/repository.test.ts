import { RescueRequestRepository } from '../../../src/repositories/rescue-request/repository';

jest.mock('../../../src/db/db', () => {
  const tx = {
    rescueRequest: { create: jest.fn() },
    rescueRequestPhoto: { createMany: jest.fn() },
  };
  return {
    __esModule: true,
    default: {
      rescueRequest: { findUnique: jest.fn() },
      $transaction: jest.fn((fn: any) => fn(tx)),
    },
  };
});

const prisma = require('../../../src/db/db').default;

describe('RescueRequestRepository', () => {
  const repo = new RescueRequestRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRescueRequestById', () => {
    it('queries prisma with correct include and where', async () => {
      prisma.rescueRequest.findUnique.mockResolvedValueOnce({ rescueRequestId: 'id' });
      const res = await repo.getRescueRequestById('id');
      expect(res).toEqual({ rescueRequestId: 'id' });
      expect(prisma.rescueRequest.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { rescueRequestId: 'id' },
        include: expect.any(Object),
      }));
    });

    it('propagates prisma errors', async () => {
      prisma.rescueRequest.findUnique.mockRejectedValueOnce(new Error('db'));
      await expect(repo.getRescueRequestById('id')).rejects.toThrow('db');
    });
  });

  describe('createRescueRequestWithPhotos', () => {
    it('creates rescue request and photos in a transaction', async () => {
      const created = { rescueRequestId: 'new' };
      prisma.$transaction.mockImplementationOnce((fn: any) => {
        const tx = {
          rescueRequest: { create: jest.fn().mockResolvedValue(created) },
          rescueRequestPhoto: { createMany: jest.fn().mockResolvedValue({ count: 2 }) },
        };
        return fn(tx);
      });

      const result = await repo.createRescueRequestWithPhotos({ reporterId: 'rep' } as any, ['u1', 'u2']);
      expect(result).toBe(created);
    });

    it('propagates errors', async () => {
      prisma.$transaction.mockRejectedValueOnce(new Error('tx'));
      await expect(repo.createRescueRequestWithPhotos({} as any, [])).rejects.toThrow('tx');
    });
  });
});


