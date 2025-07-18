// next.config.js
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Habilita la nueva estructura de carpetas
  },
  images: {
    domains: ['res.cloudinary.com', 'www.starbucks.es', 'www.starbucks.pe'], // Permite imágenes externas
  },
}
