# Goal Lamp

A Node-based control application for my Raspberry Pi Goal Lamp project.

## Hardware

- Raspberry Pi Zero W
- Rotating LED Light
- 5v Relay
- USB speaker

### Hardware Setup

- *Power* - I provide 5v, 3amps via the original port on the rotating red light. I've cut and soldered the power cables from a Micro-USB cable to power the Pi.
- *Light* - The light is switched by a 5v Relay wired up to the Pi via pins 4, 6 (Power), and 7 (Control).
- *Sound* - A small, 500ma USB stereo speaker with one speaker unsoldered and removed is plugged into the Pi's only USB port.

## Software

- Node.js v10
- yarn
- forever

### How to Use

#### REST Interface

- `GET http://localhost/api/lamp` - Retrieve lamp status
- `POST http://localhost/api/lamp` - Toggle the lamp

```
POST Body

{
  // Duration - Integer - OPTIONAL
  // Amount of time to power the light if `team` is not provided. Does not play any sounds.
  duration: 10, // Default is 30, overwriteable in `config.js`, overwritable per REST call

  // Team - String - OPTIONAL
  // The team's horn to play, light will power up for duration of the horn sound.
  team: 'blackhawks' // See "Supported Teams" below
}
```

#### MQTT Interface

Provide a `mqttServer` in `config.js` to enable the MQTT server.

- Publish `ON/OFF` to `goallamp/{team}/set`.
- Subscribe to `goallamp/state` to get `ON/OFF` status of lamp.

### Supported Teams

I am a Blackhawks fan first and a Lightning fan second. Those two are included in `src/audio/teams`. You can include any other teams (or any other sounds), by dropping a `WAV` file in that folder. Keep the name of the file free of spaces and lowercase. You use the filename (minus extension) as the `team` parameter when making the call to turn the lamp on.

### Starting the Service

1. Clone this repo on to your device.
2. Run `yarn` to install the dependencies.
3. Run `forever start /path/to/goallamp/startup.json`

I recommend adding the `forever` command to your `/etc/rc.local` so that it starts on boot every time.

## License

MIT
