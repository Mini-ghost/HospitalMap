module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx'
  ],
  theme: {
    extend: {
      inset: {
        '4': '1rem',
        '32': '8rem'
      },
      borderRadius: {
        'xl': '1rem'
      }
    }
  },
  variants: {
    responsive: ['responsive'],
    borderWidth: ['last'],
    margin: ['last']
  },
  plugins: [],
}
