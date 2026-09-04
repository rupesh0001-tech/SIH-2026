# Farmer Setu Mobile App Guidelines

## Expo & React Native

* Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.
* **Keyboard Avoidance**: Whenever an input that triggers a virtual keyboard is focused/clicked, it must NEVER be overlapped by the keyboard. Always wrap input flows with proper keyboard avoidance (`KeyboardAvoidingView` with platform-specific behavior/offset, `ScrollView` with `keyboardShouldPersistTaps="handled"`, `automaticallyAdjustKeyboardInsets={true}`, and appropriate bottom insets) so that the focused input shifts/scrolls smoothly above the keyboard.
* **Pure Modular Components**: Build pure, modular, reusable components in `src/components/`. Do not dump everything into single screen files.
* **Interfaces**: All interfaces must be defined in `src/interfaces/` and exported via `src/interfaces/index.ts`.
* **Aesthetics**: Follow the clean modern UI theme with pastel highlights (`#A28EF9`, `#A4F5A6`, `#FFD89D`, `#ECEEF0`) and floating dark navigation.
