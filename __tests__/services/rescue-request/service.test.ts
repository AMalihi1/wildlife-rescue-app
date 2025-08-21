jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: jest.fn().mockImplementation(() => ({ send: jest.fn().mockResolvedValue({}) })),
  PublishCommand: jest.fn(),
}));

jest.mock('../../../src/config', () => ({
  AWS_REGION: 'eu-west-1',
  eventTopics: { 'rescue-request.created': 'arn:aws:sns:eu-west-1:123:created' },
  eventQueues: {},
}));

import { RescueRequestService } from '../../../src/services/rescue-request/service';
import { RescueRequestRepository } from '../../../src/repositories/rescue-request/repository';
import { UserRepository } from '../../../src/repositories/user/repository';
import { NotFoundError } from '../../../src/lib/errors';
import { EventType } from '../../../src/types/enums';
import { EventPublisher } from '../../../src/lib/event-publisher';


describe('RescueRequestService', () => {
  const mockRepo: jest.Mocked<RescueRequestRepository> = {
    getRescueRequestById: jest.fn(),
    createRescueRequestWithPhotos: jest.fn(),
  } as any;

  const mockUserRepo: jest.Mocked<UserRepository> = {
    getUserbyId: jest.fn(),
  } as any;

  const service = new (RescueRequestService as any)(mockRepo, mockUserRepo) as RescueRequestService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRescueRequestById', () => {
    it('returns mapped dto when found', async () => {
      mockRepo.getRescueRequestById.mockResolvedValueOnce({
        rescueRequestId: 'id-1',
        reporterId: 'rep-1',
        rescuerId: null,
        pickupAddress: '123',
        status: 'opened',
        description: 'desc',
        animalType: 'hedgehog',
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [{ photoUrl: 'u' }],
        reporter: { fullName: 'A', phoneNumber: '1', email: 'a@a.com' },
        rescuer: null,
      } as any);

      const dto = await service.getRescueRequestById('id-1');
      expect(dto?.rescueRequestId).toBe('id-1');
      expect(mockRepo.getRescueRequestById).toHaveBeenCalledWith('id-1');
    });

    it('returns null when not found', async () => {
      mockRepo.getRescueRequestById.mockResolvedValueOnce(null);
      const dto = await service.getRescueRequestById('missing');
      expect(dto).toBeNull();
    });

    it('throws when repo throws', async () => {
      mockRepo.getRescueRequestById.mockRejectedValueOnce(new Error('boom'));
      await expect(service.getRescueRequestById('err')).rejects.toThrow('boom');
    });
  });

  describe('createRescueRequest', () => {
    const base = {
      reporterId: '00000000-0000-0000-0000-000000000000',
      pickupAddress: '123 Street',
      description: 'help',
      photos: [{ photoUrl: 'https://x/1.jpg' }],
      animalType: 'hedgehog' as any,
    };

    it('throws NotFoundError if reporter missing', async () => {
      mockUserRepo.getUserbyId.mockResolvedValueOnce(null);
      await expect(service.createRescueRequest(base as any)).rejects.toBeInstanceOf(NotFoundError);
    });

    it('creates request and publishes event', async () => {
      const publishSpy = jest.spyOn(EventPublisher.prototype as any, 'publish').mockResolvedValue(undefined);
      mockUserRepo.getUserbyId.mockResolvedValueOnce({ userId: base.reporterId } as any);
      mockRepo.createRescueRequestWithPhotos.mockResolvedValueOnce({
        rescueRequestId: 'new-id',
        reporterId: base.reporterId,
        status: 'opened',
        description: base.description,
        animalType: 'HEDGEHOG',
        pickupAddress: base.pickupAddress,
        createdAt: new Date(),
      } as any);

      const res = await service.createRescueRequest(base as any);
      expect(res).toEqual({ rescueRequestId: 'new-id' });
      expect(mockRepo.createRescueRequestWithPhotos).toHaveBeenCalled();
      expect(publishSpy).toHaveBeenCalledWith(EventType.RescueRequestCreated, expect.objectContaining({ rescueRequestId: 'new-id' }));
    });

    it('passes empty photo array when no photos provided', async () => {
      mockUserRepo.getUserbyId.mockResolvedValueOnce({ userId: base.reporterId } as any);
      mockRepo.createRescueRequestWithPhotos.mockResolvedValueOnce({ rescueRequestId: 'new-id' } as any);
      const body = { ...base, photos: [] };
      await service.createRescueRequest(body as any);
      const [, photoUrls] = (mockRepo.createRescueRequestWithPhotos.mock.calls[0] as any);
      expect(photoUrls).toEqual([]);
    });

    it('propagates repo errors', async () => {
      mockUserRepo.getUserbyId.mockResolvedValueOnce({ userId: base.reporterId } as any);
      mockRepo.createRescueRequestWithPhotos.mockRejectedValueOnce(new Error('db-fail'));
      await expect(service.createRescueRequest(base as any)).rejects.toThrow('db-fail');
    });
  });
});


