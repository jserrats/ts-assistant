import wcmatch from 'wildcard-match';
import { type Automation, type AutomationMultipleTriggers } from './types.js';
import mqtt from 'mqtt';

class Router {
  private routes: Automation[] = [];

  addAutomation(automation: Automation | AutomationMultipleTriggers) {
    if (Array.isArray(automation.trigger)) {
      automation.trigger.forEach((triggerInArray) => {
        this.routes.push({
          trigger: triggerInArray,
          callback: automation.callback,
        });
      });
    } else {
      this.routes.push(automation as Automation);
    }
  }

  route(newTopic: string, newPayload: string, packet?: { retain: boolean }) {
    this.routes.forEach((automation: Automation) => {
      const topicMatches = wcmatch(automation.trigger.topic)(newTopic);
      const payloadMatches =
        automation.trigger.payload === '*' ||
        wcmatch(automation.trigger.payload)(newPayload);

      if (topicMatches && payloadMatches) {
        automation.callback(
          {
            topic: newTopic,
            payload: newPayload,
          },
          packet as mqtt.IPublishPacket
        );
      }
    });
  }
}

export const router = new Router();
export type Message = {
  topic?: string;
  payload: string;
};
