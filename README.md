# GPSPic

Except it is rewritten in React Native with Expo go support!

Open Source GPS Camera

Mark the location of activities by embedding data onto the image. Ensure things were done where they were done and when they were done!

Features:
- Simple
- Open Source
- Multi-Platform(web, iOS, android)

### Build Status:
Not implemented

[![Android CI](https://github.com/ZeusInstitute-OSS/GPSPic_expo/actions/workflows/main.yml/badge.svg)](https://github.com/ZeusInstitute-OSS/GPSPic_expo/actions/workflows/main.yml)

# Roadmap:
✅ Done

*️⃣ Being worked on

❌ Not Done

Initial App:
- Location Bar: ✅
- Saving image: *️⃣
- File Picker for selecting output: ❌
- Proportions/Adjusting to different screens: *️⃣
- Flash Modes: ✅
- Permission Handling: *️⃣
- Move away from legacy expo-camera: ❌
- Support being called from another app(and returning that pic): ❌

## Testing

### Clone this repo

You can do this using:
```
git clone https://github.com/ZeusInstitute-OSS/TrainerApp TrainerApp
```

Now, enter the directory using `cd TrainerApp`
### Set up nvm 

You can do this by following [these](https://github.com/nvm-sh/nvm#installing-and-updating) instructions


### Use recent node using nvm
```
nvm use node
```
### Install Deps

```
npx expo install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-system-ui expo-screen-orientation
```

### Run App
```
npx expo start --tunnel
```

Use the expo go app to connect to it