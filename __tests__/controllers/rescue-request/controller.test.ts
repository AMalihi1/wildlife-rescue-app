import request from 'supertest';
import express, { Request, Response } from 'express';
import { RescueRequestController } from '../../../src/controllers/rescue-request/controller';
import { IRescueRequestService } from '../../../src/services/rescue-request/service.interface';

// Build an express app with the controller wired for testing
function createTestApp(service: IRescueRequestService) {
  const app = express();
  app.use(express.json());
  const controller = new RescueRequestController(service);
  app.get('/rescue-requests/:id', (req: Request, res: Response) => controller.getRescueRequestById(req, res));
  app.post('/rescue-requests', (req: Request, res: Response) => controller.createRescueRequest(req, res));
  return app;
}

describe('RescueRequestController', () => {
  const mockService: jest.Mocked<IRescueRequestService> = {
    getRescueRequestById: jest.fn(),
    createRescueRequest: jest.fn(),
  };

  const app = createTestApp(mockService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /rescue-requests/:id', () => {
    it('returns 200 with payload when found', async () => {
      mockService.getRescueRequestById.mockResolvedValueOnce({
        rescueRequestId: 'uuid-1',
        reporter: { reporterId: 'rep-1', fullName: 'John Doe', phoneNumber: '1234567890', email: 'j@d.com' },
        rescuer: null,
        pickupAddress: '123 Street',
        status: 'opened' as any,
        description: 'injured bird',
        photos: [{ photoUrl: 'https://example.com/1.jpg' }],
        animalType: 'hedgehog' as any,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      });

      const res = await request(app).get('/rescue-requests/uuid-1');
      expect(res.status).toBe(200);
      expect(res.body.rescueRequestId).toBe('uuid-1');
      expect(mockService.getRescueRequestById).toHaveBeenCalledWith('uuid-1');
    });

    it('returns 404 when not found', async () => {
      mockService.getRescueRequestById.mockResolvedValueOnce(null);

      const res = await request(app).get('/rescue-requests/not-found');
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('not found');
    });

    it('returns 500 when service throws', async () => {
      mockService.getRescueRequestById.mockRejectedValueOnce(new Error('boom'));
      const res = await request(app).get('/rescue-requests/err');
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal Server Error');
    });
  });

  describe('POST /rescue-requests', () => {
    const validBody = {
      reporterId: '00000000-0000-0000-0000-000000000000',
      description: 'help',
      animalType: 'hedgehog',
      pickupAddress: '123 Street',
      photos: [{ photoUrl: 'https://example.com/1.jpg' }],
    };

    it('returns 201 on success', async () => {
      mockService.createRescueRequest.mockResolvedValueOnce({ rescueRequestId: 'new-id' });
      const res = await request(app).post('/rescue-requests').send(validBody);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ rescueRequestId: 'new-id' });
      expect(mockService.createRescueRequest).toHaveBeenCalled();
    });

    it('returns 400 when validation fails', async () => {
      const invalid = { ...validBody, reporterId: 'not-a-uuid' };
      const res = await request(app).post('/rescue-requests').send(invalid);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors?.length).toBeGreaterThan(0);
    });

    it('returns 404 when service throws NotFoundError', async () => {
      const { NotFoundError } = jest.requireActual('../../../src/lib/errors');
      mockService.createRescueRequest.mockRejectedValueOnce(new NotFoundError('Reporter not found'));
      const res = await request(app).post('/rescue-requests').send(validBody);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Reporter not found');
    });

    it('returns 500 when service throws unknown error', async () => {
      mockService.createRescueRequest.mockRejectedValueOnce(new Error('boom'));
      const res = await request(app).post('/rescue-requests').send(validBody);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal Server Error');
    });
  });
});


