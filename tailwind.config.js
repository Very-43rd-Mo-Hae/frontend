const relinkColors = {
    white: '#ffffff',
    ink: '#17171b',
    gray: {
        700: '#5e5d5d',
        500: '#7c7d86',
        400: '#b4b4b4',
        200: '#e6e6e6',
    },
    lavender: {
        intense: '#7f87ff',
        middle: '#cdd0ff',
        soft: '#eef0ff',
    },
    blue: '#5888ff',
    mint: '#4fd7c5',
    yellow: '#ffd166',
    coral: '#ff8f70',
    rose: '#ff7aa2',
    green: '#77d46b',
    cyan: '#61dddd',
    scheduleGreen: '#74dc94',
    scheduleYellow: '#fee73d',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                relink: relinkColors,
            },
            fontFamily: {
                sans: ['var(--relink-font-sans)'],
                display: ['var(--relink-font-display)'],
            },
            fontSize: {
                sm: ['12px', { lineHeight: '16px' }],
                md: ['14px', { lineHeight: '18px' }],
                lg: ['18px', { lineHeight: '24px' }],
                xl: ['24px', { lineHeight: '32px' }],
            },
            boxShadow: {
                'relink-card': '0px 1px 10px 0px #cdd0ff',
            },
            borderColor: {
                'relink-card': 'rgba(230, 230, 230, 0.47)',
            },
        },
    },
    plugins: [],
};
