/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./screens/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366F1',
                    dark: '#4F46E5',
                    light: '#818CF8',
                },
                secondary: {
                    DEFAULT: '#10B981',
                    dark: '#059669',
                },
                accent: '#F59E0B',
                background: {
                    DEFAULT: '#0F172A',
                    light: '#1E293B',
                },
                card: {
                    DEFAULT: '#1E293B',
                    border: '#334155',
                },
                text: {
                    DEFAULT: '#F8FAFC',
                    light: '#94A3B8',
                    muted: '#64748B',
                },
                error: '#EF4444',
                success: '#10B981',
                warning: '#F59E0B',
                info: '#3B82F6',
            },
        },
    },
    plugins: [],
};
