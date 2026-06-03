import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Button,
  SettingsGroup,
  SettingsInputRow,
  SettingsOverlayRow,
  SettingsSelectRow,
  SettingsThemeRow,
  SettingsToggleRow,
  type SelectDropdownOption,
  type ThemeOption
} from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const languageOptions: SelectDropdownOption[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" }
];

const themeOptions: ThemeOption[] = [
  { value: "classic", label: "Classic", swatches: ["#1CB0F6", "#58CC02", "#FFB648"] },
  { value: "ocean", label: "Ocean", swatches: ["#2BA6E6", "#5B7CFF", "#84D8FF"] },
  { value: "sunset", label: "Sunset", swatches: ["#FF8B3D", "#FF5D73", "#FFB648"] },
  { value: "forest", label: "Forest", swatches: ["#2CC58A", "#6EDE8A", "#1D2B53"] }
];

export default function SettingsScreen() {
  const [soundOn, setSoundOn] = useState(true);
  const [animationOn, setAnimationOn] = useState(true);
  const [motivationOn, setMotivationOn] = useState(false);
  const [listeningOn, setListeningOn] = useState(true);
  const [language, setLanguage] = useState("zh");
  const [theme, setTheme] = useState("classic");
  const [nickname, setNickname] = useState("Learner");

  return (
    <ScreenTemplate
      title="Settings Group"
      description="Row-based lesson settings. Language select opens a bottom drawer; privacy row uses drawer-bottom too."
    >
      <View style={styles.wrapper}>
        <SettingsGroup title="Lesson experience">
          <SettingsToggleRow label="Sound effects" value={soundOn} onValueChange={setSoundOn} />
          <SettingsToggleRow label="Animations" value={animationOn} onValueChange={setAnimationOn} />
          <SettingsToggleRow
            label="Motivational messages"
            value={motivationOn}
            onValueChange={setMotivationOn}
          />
          <SettingsToggleRow
            label="Listening exercises"
            value={listeningOn}
            onValueChange={setListeningOn}
          />
        </SettingsGroup>

        <SettingsGroup title="Account">
          <SettingsThemeRow
            label="Theme"
            drawerTitle="Choose a theme"
            value={theme}
            options={themeOptions}
            onValueChange={setTheme}
          />
          <SettingsSelectRow
            label="Learning language"
            value={language}
            options={languageOptions}
            onValueChange={setLanguage}
          />
          <SettingsInputRow
            label="Display name"
            value={nickname}
            onChangeText={setNickname}
            placeholder="Enter name"
          />
          <SettingsOverlayRow
            label="Privacy settings"
            value="Manage"
            presentation="drawer-bottom"
            overlay={({ close }) => (
              <View style={styles.overlayContent}>
                <Text style={styles.overlayTitle}>Privacy settings</Text>
                <Text style={styles.overlayDescription}>
                  Use presentation=&quot;drawer-top&quot; or &quot;drawer-bottom&quot; for edge sheets.
                </Text>
                <Button label="Done" backgroundColor="#1CB0F6" onPress={close} />
              </View>
            )}
          />
        </SettingsGroup>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    maxWidth: 520,
    gap: spacing["2xl"]
  },
  overlayContent: {
    gap: spacing.lg
  },
  overlayTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
    textAlign: "center"
  },
  overlayDescription: {
    color: colors.textMuted,
    fontSize: typography.bodyLg,
    lineHeight: 22,
    textAlign: "center"
  }
});
