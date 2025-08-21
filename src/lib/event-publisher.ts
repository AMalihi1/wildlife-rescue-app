import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { eventTopics, AWS_REGION } from "../config";

const snsClient = new SNSClient({ region: AWS_REGION });

export class EventPublisher {
  async publish(eventType: string, payload: object) {
    const topicArn = eventTopics[eventType];

    if (!topicArn) {
      throw new Error(`SNS topic ARN not found for event type: ${eventType}`);
    }

    const command = new PublishCommand({
      TopicArn: topicArn,
      Message: JSON.stringify(payload),
      MessageAttributes: {
        eventType: {
          DataType: "String",
          StringValue: eventType,
        },
      },
    });

    await snsClient.send(command);
  }
}