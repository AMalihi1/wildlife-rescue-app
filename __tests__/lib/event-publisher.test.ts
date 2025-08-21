import { EventPublisher } from '../../src/lib/event-publisher';

jest.mock('@aws-sdk/client-sns', () => {
  return {
    SNSClient: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({ MessageId: 'mid' }),
    })),
    PublishCommand: jest.fn().mockImplementation((args) => ({ args })),
  };
});

jest.mock('../../src/config', () => ({
  AWS_REGION: 'eu-west-1',
  eventTopics: {
    'rescue-request.created': 'arn:aws:sns:eu-west-1:123:created',
  },
}));

describe('EventPublisher', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('publishes message to SNS with attributes', async () => {
    const { EventPublisher: EP } = require('../../src/lib/event-publisher');
    const publisher = new EP();
    await expect(publisher.publish('rescue-request.created', { id: '1' })).resolves.toBeUndefined();
    const { SNSClient } = require('@aws-sdk/client-sns');
    expect((SNSClient as jest.Mock).mock.results[0].value.send).toHaveBeenCalled();
  });

  it('throws if topic arn not found', async () => {
    const publisher = new EventPublisher();
    await expect(publisher.publish('unknown.event', { x: 1 } as any)).rejects.toThrow(/topic ARN not found/i);
  });

  it('propagates sns send errors', async () => {
    const { SNSClient } = require('@aws-sdk/client-sns');
    (SNSClient as jest.Mock).mockImplementationOnce(() => ({ send: jest.fn().mockRejectedValue(new Error('sns')) }));
    const { EventPublisher: EP } = require('../../src/lib/event-publisher');
    const publisher = new EP();
    await expect(publisher.publish('rescue-request.created', {})).rejects.toThrow('sns');
  });
});


