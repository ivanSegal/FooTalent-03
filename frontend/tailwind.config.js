/** @type {import('tailwindcss').Config} */

module.exports = {
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            'primary-blue': '#0E1046',
            'secondary-blue': '#2F3167',
            'tertiary-blue': '2E2E48',
            'white': '#ffffff',
            'success': '#68AC34',
            'warning': '#E3E366',
            'error': '#D82D2D'
        },
    extend: {
      fontFamily: {
        title: ['DM Sans, sans-serif'] // crea la clase `font-title`
      },
      fontSize: {
        'title': '36px', // crea la clase `text-title`
        'subtitle': '24px',
        'button': '18px',
        'body': '18px'
      },
        }
        
    }
}