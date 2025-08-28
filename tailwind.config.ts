import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 自定义颜色系统 - 基于现有设计
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8b93f8',
          500: '#667eea', // 主色调
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#764ba2', // 次要色调
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#74b9ff', // 强调色
          600: '#0984e3',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e3e5e6',
          300: '#c6c8ca',
          400: '#a0aec0',
          500: '#636e72',
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923',
        }
      },
      
      // 自定义字体
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
      },
      
      // 自定义阴影 - 现代化升级
      boxShadow: {
        'glass': '0 32px 64px rgba(0, 0, 0, 0.12), 0 16px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'glass-dark': '0 32px 64px rgba(0, 0, 0, 0.4), 0 16px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 16px 48px rgba(116, 185, 255, 0.25), 0 8px 24px rgba(116, 185, 255, 0.15)',
        'card-active': '0 4px 16px rgba(116, 185, 255, 0.2)',
        'input': '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'input-focus': '0 12px 32px rgba(102, 126, 234, 0.2), 0 6px 16px rgba(102, 126, 234, 0.15)',
        'button': '0 8px 24px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(102, 126, 234, 0.2)',
        'button-hover': '0 12px 32px rgba(102, 126, 234, 0.4), 0 6px 16px rgba(102, 126, 234, 0.3)',
        'floating': '0 24px 48px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.1)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      
      // 自定义背景渐变 - 现代化升级
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #74b9ff 70%, #00cec9 100%)',
        'primary-gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
        'card-gradient-dark': 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        'text-gradient': 'linear-gradient(135deg, #667eea, #764ba2, #74b9ff)',
        'button-gradient': 'linear-gradient(135deg, #667eea, #764ba2)',
        'button-gradient-hover': 'linear-gradient(135deg, #5a67d8, #6b46c1)',
        'accent-gradient': 'linear-gradient(135deg, #74b9ff, #00cec9)',
        'warm-gradient': 'linear-gradient(135deg, #ff7675, #fd79a8, #fdcb6e)',
        'cool-gradient': 'linear-gradient(135deg, #74b9ff, #0984e3, #00b894)',
        'aurora': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #74b9ff 50%, #00cec9 75%, #55a3ff 100%)',
        'mesh': 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(116, 185, 255, 0.3) 0%, transparent 50%)',
      },
      
      // 自定义边框圆角
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      
      // 自定义动画 - 现代化升级
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-gentle': 'bounceGentle 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(116, 185, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(116, 185, 255, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      // 自定义毛玻璃效果
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // 支持类切换深色模式
} satisfies Config
