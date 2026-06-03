import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Button,
  TextField,
  composeTextFieldRules,
  emailRule,
  passwordRule,
  phoneRule,
  requiredRule,
  type TextFieldRef
} from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const passwordValidate = passwordRule(8);
const emailValidate = composeTextFieldRules(
  requiredRule({ message: "请输入邮箱。" }),
  emailRule()
);
const phoneValidate = composeTextFieldRules(
  requiredRule({ message: "请输入手机号。" }),
  phoneRule()
);

export default function TextFieldScreen() {
  const [age, setAge] = useState("");
  const [score, setScore] = useState("30");
  const [blurPassword, setBlurPassword] = useState("222");
  const [livePassword, setLivePassword] = useState("222");
  const [submitPassword, setSubmitPassword] = useState("222");
  const [controlledPassword, setControlledPassword] = useState("222");
  const [controlledError, setControlledError] = useState<string | undefined>();
  const [email, setEmail] = useState("demo@");
  const [phone, setPhone] = useState("1380013");
  const submitFieldRef = useRef<TextFieldRef>(null);

  return (
    <ScreenTemplate
      title="Text Fields"
      description="Inputs support clear actions, password visibility, theme overrides, and flexible validation: blur, live change, submit via ref, or fully controlled errors."
    >
      <View style={styles.column}>
        <TextField placeholder="年龄" value={age} onChangeText={setAge} />
        <TextField placeholder="年龄" value={score} onChangeText={setScore} />

        <Text style={styles.sectionLabel}>失焦校验</Text>
        <TextField
          value={blurPassword}
          onChangeText={setBlurPassword}
          secureTextEntry
          showPasswordToggle
          validate={passwordValidate}
          validateOn="blur"
        />

        <Text style={styles.sectionLabel}>实时校验</Text>
        <TextField
          value={livePassword}
          onChangeText={setLivePassword}
          secureTextEntry
          showPasswordToggle
          validate={passwordValidate}
          validateOn="change"
        />

        <Text style={styles.sectionLabel}>邮箱 / 手机号规则</Text>
        <TextField
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          validate={emailValidate}
          validateOn="blur"
        />
        <TextField
          placeholder="手机号"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          validate={phoneValidate}
          validateOn="blur"
        />

        <Text style={styles.sectionLabel}>提交时校验（ref）</Text>
        <TextField
          ref={submitFieldRef}
          value={submitPassword}
          onChangeText={setSubmitPassword}
          secureTextEntry
          showPasswordToggle
          validate={passwordValidate}
          validateOn="submit"
        />
        <Button
          label="提交校验"
          backgroundColor="#FF4B4B"
          onPress={() => submitFieldRef.current?.validate()}
        />

        <Text style={styles.sectionLabel}>提交时校验（受控）</Text>
        <TextField
          value={controlledPassword}
          onChangeText={setControlledPassword}
          secureTextEntry
          showPasswordToggle
          error={Boolean(controlledError)}
          errorMessage={controlledError}
        />
        <Button
          label="提交校验"
          backgroundColor="#FF4B4B"
          onPress={() => setControlledError(passwordValidate(controlledPassword) ?? undefined)}
        />

        <TextField
          placeholder="自定义主题"
          defaultValue="试试清除"
          theme={{
            backgroundColor: "#FFF4E8",
            borderColor: "#FFD6A8",
            focusedBorderColor: "#FF9600",
            textColor: "#7A4B00",
            placeholderColor: "#C58B45",
            selectionColor: "#FF9600",
            suffixIconColor: "#FF9600",
            clearButtonBackgroundColor: "#FFB648",
            clearButtonIconColor: "#FFFFFF"
          }}
        />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  column: {
    width: "100%",
    maxWidth: 420,
    gap: spacing.lg
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    marginBottom: -spacing.sm,
    textTransform: "uppercase"
  }
});
