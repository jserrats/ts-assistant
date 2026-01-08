import { zigbee, esphome, telegram, Timer, Sun, Alarm, assistant, globalEventManager } from "@ts-assistant/mqtt-assistant"

console.log("[i] Starting Automations")
telegram.client.info("Starting Automations")


// // Misc

new zigbee.ZigbeeMonitor()
new esphome.MonitorESPHome()

// // Living Room
const livingroomRemote = new zigbee.remotes.RemoteE2002("livingroom_remote")
const livingroomSmoothLights = new zigbee.switches.E1603("livingroom_smooth_lights")
const clock = new esphome.LightESPHome("minimatrix", "clock")
const livingRoomClockTimer = new Timer({ hours: 8 })

globalEventManager.on([livingRoomClockTimer.events.timeout, livingRoomClockTimer.events.cancel], () => { clock.setOn() })
livingroomRemote.on(livingroomRemote.button.holdDown, () => { livingRoomClockTimer.cancel() })
livingroomRemote.on(livingroomRemote.button.up, () => { livingroomSmoothLights.toggle() })
livingroomRemote.on(livingroomRemote.button.down, () => {
    clock.setOff()
    livingRoomClockTimer.start()
})

// // Lobby
// const lobbyLight = new zigbee.lights.LED1623G12("lobby_light")

// Workshop
const workshopPower = new zigbee.switches.E1603("workshop_power") // TODO: { autoOff: { hours: 4 } })
const workshopRemote = new zigbee.remotes.RemoteE1812("workshop_remote")
workshopRemote.on(workshopRemote.button.click, () => { workshopPower.toggle() })

// Laundry room
const laundrySensor = new zigbee.sensors.presence.IH012_RT01("laundry_presence")
const laundryLight = new zigbee.lights.LED1623G12("laundry_light")
laundrySensor.occupancy.on(laundrySensor.occupancy.events.state, (state: boolean) => { if (state) { laundryLight.setOn() } else { laundryLight.setOff() } })

// Music
const musicRemote = new zigbee.remotes.RemoteE2201("music_remote")
const musicMoodLight = new zigbee.lights.LED1623G12("mood_music_light")

musicRemote.on(musicRemote.button.topClick, () => { musicMoodLight.toggle() })
musicRemote.on(musicRemote.button.bottomClick, () => { musicMoodLight.setOn(brighterWarmLight) })
musicRemote.on(musicRemote.button.holdBottomClick, () => { musicMoodLight.setOn(dayLight) })


// Studio
//const studioPresence = new esphome.BinarySensorESPHome("datacenter", "studio_presence")\
const studioPresence = new zigbee.sensors.presence.IH012_RT01("studio_presence")
const studioLight = new zigbee.lights.LED1623G12("studio_light")
const studioFan = new zigbee.switches.E1603("studio_fan")
const deskPower = new zigbee.switches.E1603("desk_power")
const shelvesLight = new zigbee.lights.YSR_MINI_01_dimmer("studio_shelf_light")
const deskBacklight = new zigbee.lights.GL_C_006P("desktop_backlighting")
const bluetooth = new zigbee.switches.XMSJ("bluetooth_audio_input")
const charger = new zigbee.switches.XMSJ("wireless_charger")
charger.on(charger.newTimeStateEvent({ hours: 4 }, (state: boolean) => { return state }), () => { charger.setOff() })

const deskTimer = new Timer({ minutes: 10 })

deskTimer.on(deskTimer.events.timeout, () => {
    deskPower.setOff()
    bluetooth.setOff()
    shelvesLight.brightness.set(100)
})

const shelvesLightTimer = new Timer({ minutes: 20 })

shelvesLightTimer.on(shelvesLightTimer.events.timeout, () => {
    shelvesLight.setOff()
    studioFan.setOff()
    deskBacklight.setOff()
})

studioPresence.on(studioPresence.events.state, (state: boolean) => {
    if (state) {
        deskTimer.cancel();
        shelvesLightTimer.cancel()
        studioLight.setOn()
        deskPower.setOn()
        shelvesLight.setOn({ brightness: 180 })
        deskBacklight.setOn()
    } else if (state === false) { // if new state is undefined do nothing
        studioLight.setOff()
        deskTimer.start()
        shelvesLightTimer.start()
    }
})

// Bedroom
const bedroomRemoteLeft = new zigbee.remotes.RemoteTS0044("bedroom_left_remote")
const bedroomRemoteRight = new zigbee.remotes.RemoteTS0044("bedroom_right_remote")

const bedroomFan = new zigbee.switches.E1603("bedroom_fan")
const bedroomFanTimer = new Timer({ minutes: 30 }, "bedroom_fan")

bedroomFanTimer.on(bedroomFanTimer.events.timeout, () => {
    bedroomFan.setOff()
})

globalEventManager.on(
    [
        bedroomRemoteLeft.button.bottomLeftHold,
        bedroomRemoteRight.button.bottomLeftHold
    ], () => { bedroomFanTimer.cancel() })

globalEventManager.on(
    [
        bedroomRemoteLeft.button.bottomLeftSingleClick,
        bedroomRemoteRight.button.bottomLeftSingleClick
    ], () => {
        bedroomFan.toggle();
        bedroomFanTimer.cancel()
    })

globalEventManager.on(
    [
        bedroomRemoteLeft.button.bottomLeftDoubleClick,
        bedroomRemoteRight.button.bottomLeftDoubleClick
    ], () => {
        bedroomFan.setOn()
        bedroomFanTimer.start()
    })

// lights

const dayLight = { brightness: 254, color_temp: 250 }
const warmLight = { brightness: 5, color_temp: 450 }
const brighterWarmLight = { brightness: 218, color_temp: 450 }

const bedroomLightLeft = new zigbee.lights.LED1623G12("bedroom_left_light")
const bedroomLightRight = new zigbee.lights.LED1623G12("bedroom_right_light")
const bedroomMoodLight = new zigbee.switches.E1603("bedroom_mood_light")
const bedroomRemoteEntrance = new zigbee.remotes.RemoteE2201("bedroom_remote")
const nightStandLight = new esphome.LightESPHome("bedroom", "nightstand_led")

globalEventManager.on(
    [
        bedroomRemoteLeft.button.topLeftHold,
        bedroomRemoteRight.button.topLeftHold
    ], () => { nightStandLight.setOff() })

globalEventManager.on(
    [
        bedroomRemoteRight.button.bottomRightSingleClick,
        bedroomRemoteLeft.button.bottomRightSingleClick,
        bedroomRemoteEntrance.button.topClick
    ],
    () => {
        if (bedroomLightLeft.state || bedroomLightRight.state || bedroomMoodLight.state) {
            bedroomLightLeft.setOff()
            bedroomLightRight.setOff()
            bedroomMoodLight.setOff()
        } else {
            bedroomLightLeft.setOn(dayLight)
            bedroomLightRight.setOn(dayLight)
        }
    })

globalEventManager.on(
    [
        bedroomRemoteRight.button.topLeftSingleClick,
        bedroomRemoteLeft.button.topLeftSingleClick,
        bedroomRemoteEntrance.button.bottomClick
    ],
    () => {
        if (bedroomMoodLight.state) {
            bedroomMoodLight.setOff()
        } else {
            bedroomMoodLight.setOn()
            bedroomLightRight.setOff()
            bedroomLightLeft.setOff()
        }
    })

globalEventManager.on(
    [
        bedroomRemoteRight.button.bottomRightDoubleClick,
        bedroomRemoteLeft.button.bottomRightDoubleClick
    ], () => {
        bedroomLightLeft.setOn(warmLight)
        bedroomLightRight.setOn(warmLight)
    })



bedroomRemoteRight.on(bedroomRemoteRight.button.bottomRightHold, () => {
    bedroomLightLeft.setOff()
    bedroomLightRight.setOn(warmLight)
})
bedroomRemoteLeft.on(bedroomRemoteLeft.button.bottomRightHold, () => {
    bedroomLightRight.setOff()
    bedroomLightLeft.setOn(warmLight)
})


// // mosquito

const mosquitoRepellant = new zigbee.switches.E1603("mosquito_power")
const mosquitoTimer = new Timer({ hours: 8 }, "mosquito")
mosquitoTimer.on(mosquitoTimer.events.timeout, () => { mosquitoRepellant.setOff() })

globalEventManager.on(
    [
        bedroomRemoteRight.button.topRightSingleClick,
        bedroomRemoteLeft.button.topRightSingleClick
    ], () => {
        if (mosquitoRepellant.state) {
            mosquitoRepellant.setOff()
            mosquitoTimer.cancel()
        } else {
            mosquitoRepellant.setOn()
            mosquitoTimer.start()
        }
    })

// // Kitchen
const sandwich = new esphome.SwitchESPHome("sandwich", "sandwich")
const sandwichTimer = new Timer({ minutes: 5 }, "sandwich")
sandwichTimer.on(sandwichTimer.events.timeout, () => { sandwich.setOff() })
sandwich.on(sandwich.events.state, () => { if (sandwich.state) { sandwichTimer.start() } else { sandwichTimer.cancel() } })
const airfryer_power = new zigbee.switches.BSD29_1("airfryer_power")
new assistant.CustomSensor<boolean>("airfryer_binary", airfryer_power.power, (value: number) => {
    return (value as number > 10)
})
// // weather

new Sun(41.3831173, 2.1640883)
// new Weather(41.3831173, 2.1640883)

// // alarm

const door = new zigbee.sensors.closure.TS0203("door_closure_sensor", true)
const window1 = new zigbee.sensors.closure.TS0203("studio_window_closure_sensor")
const window2 = new zigbee.sensors.closure.TS0203("music_window_closure_sensor")

new Alarm("home", [door.contact, window1.contact, window2.contact])