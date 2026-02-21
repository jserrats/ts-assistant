import { client } from '../../../../../mqtt.js';
import { router } from '../../../../../router.js';
import {
  BrightLightZigbee,
  LightZigbee,
  TemperatureLightZigbee,
} from '../base.js';

jest.mock('../../../../../mqtt', () => ({
  client: {
    publish: jest.fn((newTopic: string, newPayload: string) => {
      router.route(newTopic, newPayload);
    }),
  },
}));

jest.useFakeTimers();

describe('LightZigbee', () => {
  let light: LightZigbee;

  beforeAll(async () => {
    light = new LightZigbee('test1');
  });

  afterEach(async () => {
    (client.publish as jest.Mock).mockClear();
  });

  it('should update status', async () => {
    expect(light.state).toBeUndefined();
    router.route(
      light.topic,
      `{"brightness":254,"color_mode":"color_temp","color_options":{"execute_if_off":false},"color_temp":250,"color_temp_startup":null,"effect":null,"identify":null,"level_config":{"current_level_startup":"previous","execute_if_off":false,"on_level":"previous","on_off_transition_time":5},"linkquality":72,"power_on_behavior":"on","state":"ON","update":{"installed_version":587814449,"latest_release_notes":"https://ww8.ikea.com/ikeahomesmart/releasenotes/releasenotes.html","latest_source":"https://raw.githubusercontent.com/Koenkk/zigbee-OTA/master/images/IKEA/tradfri-sy5882-bulb-ws_release_prod_v587814449_185b3c4d-da1b-4867-8c16-2cee1fc5c11d.ota","latest_version":587814449,"state":"idle"},"update_available":false}`
    );
    expect(light.state).toBe(true);
    router.route(light.topic, JSON.stringify({ state: 'OFF' }));
    expect(light.state).toBe(false);
  });

  it('should turn on', async () => {
    light.setOn();
    expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
      `${light.topic}/set`
    );
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state
    ).toStrictEqual('ON');
  });

  it('should turn off', async () => {
    light.setOff();
    expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
      `${light.topic}/set`
    );
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state
    ).toStrictEqual('OFF');
  });

  it('should toggle', async () => {
    light.toggle();
    expect((client.publish as jest.Mock).mock.calls[0]).toStrictEqual([
      `${light.topic}/set`,
      'TOGGLE',
    ]);
  });
});

describe('BrightLightZigbee', () => {
  let light: BrightLightZigbee;

  beforeAll(async () => {
    light = new BrightLightZigbee('test1');
  });

  afterEach(async () => {
    (client.publish as jest.Mock).mockClear();
  });

  it('should update brightness', async () => {
    expect(light.brightness.state).toBeUndefined();
    router.route(light.topic, JSON.stringify({ brightness: 50 }));
    expect(light.brightness.state).toBe(50);
  });

  it('should set brightness', async () => {
    expect(light.state).toBeUndefined();
    light.brightness.set(70);
    expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
      `${light.topic}/set`
    );
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state
    ).toStrictEqual('ON');
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).brightness
    ).toStrictEqual(70);
  });

  it('should turn on with options', async () => {
    expect(light.state).toBeUndefined();
    light.setOn({ brightness: 70 });
    expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
      `${light.topic}/set`
    );
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state
    ).toStrictEqual('ON');
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).brightness
    ).toStrictEqual(70);
  });
});

describe('TemperatureLightZigbee', () => {
  let light: TemperatureLightZigbee;

  beforeAll(async () => {
    light = new TemperatureLightZigbee('test1');
  });

  afterEach(async () => {
    (client.publish as jest.Mock).mockClear();
  });

  it('should update color temp', async () => {
    expect(light.colorTemp.state).toBeUndefined();
    router.route(light.topic, JSON.stringify({ color_temp: 50 }));
    expect(light.colorTemp.state).toBe(50);
  });

  it('should turn on with options', async () => {
    expect(light.state).toBeFalsy();
    light.setOn({ brightness: 70, color_temp: 71 });
    expect((client.publish as jest.Mock).mock.calls[0][0]).toStrictEqual(
      `${light.topic}/set`
    );
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).state
    ).toStrictEqual('ON');
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).brightness
    ).toStrictEqual(70);
    expect(
      JSON.parse((client.publish as jest.Mock).mock.calls[0][1]).color_temp
    ).toStrictEqual(71);
  });
});
