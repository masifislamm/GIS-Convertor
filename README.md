# Map to Grid Number Zone India-IIB

[![Live Preview](preview.png)](https://gis-convertor.vercel.app/)

**Map to Grid Number Zone India-IIB** is a modern web tool that lets you convert any location on the map (longitude/latitude) to Indian Grid (IIB) Easting/Northing coordinates. Built with Google Maps and a custom projection, it's fast, intuitive, and mobile-friendly.

-----

## 🚀 [Live Demo](https://gis-convertor.vercel.app/)

-----

## ✨ Features

  - 🌏 **Interactive Google Map** – Click or search for any place in India.
  - 📍 **Instant Grid Conversion** – Get IIB Easting/Northing for any point.
  - 🔄 **Live Mode** – See coordinates update as you pan or zoom.
  - 📱 **Responsive Design** – Works beautifully on desktop and mobile.
  - 📋 **Copy to Clipboard** – One-click copy of all coordinate values.
  - 🔎 **Place Search** – Powered by Google Places Autocomplete.

-----

## 🖼️ Preview

[](https://gis-convertor.vercel.app/)

-----

## 🛠️ Getting Started

### 1\. Clone the repository

```sh
git clone https://github.com/masifislamm/gis-convertor.git
cd gis-convertor
```

### 2\. Install dependencies

```sh
npm install
```

### 3\. Set up your Google Maps API key

Copy `.env.example` to `.env`
Add your Google Maps API key:

```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 4\. Run the development server

```sh
npm run dev
```

Open http://localhost:5173 in your browser.

### 📦 Build for Production

```sh
npm run build
```

### 🧮 How It Works

Uses a custom projection to convert WGS84 coordinates to India-IIB grid.
Google Maps API for map display, search, and user interaction.

### 📄 License

This project is licensed under the GNU GPL v3.

### 👤 Author

Md Asif Islam

### 🌐 Links

  * [Live App](https://gis-convertor.vercel.app/)
  * [GitHub Repository](https://www.google.com/search?q=https://github.com/masifislamm/gis-convertor)

Made with ❤️ for the Bangladesh Defence force.