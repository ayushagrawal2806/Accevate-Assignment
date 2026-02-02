# Accevate Assignment 📱

This is a cross-platform mobile application built using **Expo (React Native)**.  
The app works on both Android and iOS and includes login with OTP verification and a dashboard.

---

## 🛠 Tech Stack
* Expo
* React Native
* Expo Router
* Context API
* Android Studio
* Xcode

---

## 📝 Features
* Works on Android and iOS
* Login with OTP verification
* Secure authentication flow
* Dashboard with API data
* Context API for state management
* Clean and responsive UI

---

## ▶️ How to Run the Project

### Requirements
* Node.js (v18 or later)
* Expo CLI
* Android Studio (for Android)
* Xcode (for iOS, macOS only)

**Install Expo CLI (if not installed):** `npm install -g expo-cli`

### ▶️ Run on Android
1. **Install dependencies:** `npm install`
2. **Open Android Studio** and start an **Android Emulator (Virtual Device)**.
3. **Run the app:** `npx expo run:android`  
   *This command builds the app and opens it on the Android emulator.*

### ▶️ Run on iOS (macOS only)
1. **Install dependencies:** `npm install`
2. **Make sure Xcode** and the **iOS Simulator** are installed.
3. **Run the app:** `npx expo run:ios`  
   *This command builds the app and opens it on the iOS simulator.*

---

## 📦 Generate Release Build (Optional)

### Android – Generate APK
1. `npx expo prebuild`
2. `cd android`
3. `./gradlew assembleRelease`

**APK location:** `android/app/build/outputs/apk/release/app-release.apk`

### iOS – Release Build
iOS release builds require an Apple Developer account and are generated using **Expo EAS** or **Xcode**.
