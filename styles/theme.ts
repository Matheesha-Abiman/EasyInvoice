// Premium Theme for EasyInvoice app
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Colors {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    accent: string;
    background: string;
    backgroundLight: string;
    card: string;
    cardBorder: string;
    text: string;
    textLight: string;
    textMuted: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    white: string;
    black: string;
    shadow: string;
    overlay: string;
    gradientStart: string;
    gradientEnd: string;
}

export const colors: Colors = {
    // Premium gradient-inspired colors
    primary: '#6366F1',        // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    secondary: '#10B981',      // Emerald
    secondaryDark: '#059669',
    accent: '#F59E0B',         // Amber

    // Dark theme base
    background: '#0F172A',     // Slate 900
    backgroundLight: '#1E293B', // Slate 800
    card: '#1E293B',
    cardBorder: '#334155',     // Slate 700

    // Text
    text: '#F8FAFC',           // Slate 50
    textLight: '#94A3B8',      // Slate 400
    textMuted: '#64748B',      // Slate 500

    // Status colors
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Other
    white: '#FFFFFF',
    black: '#000000',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Gradients (for reference)
    gradientStart: '#6366F1',
    gradientEnd: '#8B5CF6',
};

interface CommonStyles {
    container: ViewStyle;
    screenPadding: ViewStyle;
    card: ViewStyle;
    glassCard: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    input: ViewStyle & TextStyle;
    inputFocused: ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    buttonSecondary: ViewStyle;
    buttonSecondaryText: TextStyle;
    buttonDanger: ViewStyle;
    buttonDangerText: TextStyle;
    buttonSuccess: ViewStyle;
    label: TextStyle;
    row: ViewStyle;
    spaceBetween: ViewStyle;
    centerContent: ViewStyle;
    errorText: TextStyle;
    link: TextStyle;
    divider: ViewStyle;
    badge: ViewStyle;
    badgeText: TextStyle;
}

export const commonStyles = StyleSheet.create<CommonStyles>({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    screenPadding: {
        padding: 20,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    glassCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.backgroundLight,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: colors.text,
        marginBottom: 16,
    },
    inputFocused: {
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondaryText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    buttonDanger: {
        backgroundColor: colors.error,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDangerText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    buttonSuccess: {
        backgroundColor: colors.secondary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textLight,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginBottom: 8,
    },
    link: {
        color: colors.primaryLight,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.cardBorder,
        marginVertical: 16,
    },
    badge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default { colors, commonStyles };
