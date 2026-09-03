import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { keyboardStyles } from '../styles';

/** Shared scrolling and focused-field visibility for every form. */
export default function KeyboardForm({
  children,
  style,
  contentContainerStyle,
  ...props
}) {
  return <KeyboardAwareScrollView bottomOffset={24} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} {...props} style={[keyboardStyles.scroll, style]} contentContainerStyle={[contentContainerStyle, keyboardStyles.content]}>
      {children}
    </KeyboardAwareScrollView>;
}
