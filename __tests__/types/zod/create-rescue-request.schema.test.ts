import { createRescueRequestSchema } from '../../../src/types/zod/create-rescue-request.schema';

describe('createRescueRequestSchema', () => {
  const base = {
    reporterId: '00000000-0000-0000-0000-000000000000',
    description: 'desc',
    animalType: 'hedgehog' as any,
    pickupAddress: '123 Street',
    photos: [{ photoUrl: 'https://example.com/1.jpg' }],
  };

  it('validates a correct payload', () => {
    const res = createRescueRequestSchema.safeParse(base);
    expect(res.success).toBe(true);
  });

  it('fails on invalid uuid', () => {
    const res = createRescueRequestSchema.safeParse({ ...base, reporterId: 'bad' });
    expect(res.success).toBe(false);
  });

  it('fails on short pickupAddress', () => {
    const res = createRescueRequestSchema.safeParse({ ...base, pickupAddress: '123' });
    expect(res.success).toBe(false);
  });

  it('accepts optional description null', () => {
    const res = createRescueRequestSchema.safeParse({ ...base, description: null });
    expect(res.success).toBe(true);
  });

  it('fails when photo url invalid', () => {
    const res = createRescueRequestSchema.safeParse({ ...base, photos: [{ photoUrl: 'not-a-url' }] });
    expect(res.success).toBe(false);
  });
});


