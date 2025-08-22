# BedDualZone

BedDualZone is a React component that renders a realistic two-zone bed. Each side can display its
current temperature, target temperature, and whether heating or cooling is active. The edited side
is highlighted and can be changed by clicking the opposite zone.

## Features

- **Independent zones** for the left and right sides of the bed
- **Heating and cooling indicators** using red and blue tints
- **Current and target temperatures** shown per side
- **Schedule awareness**: shows if a schedule is running or when today's schedule starts
- **Single-side editing** with tabbed controls that switch when a zone is clicked
- **Responsive design** that scales to mobile and desktop screens with a natural bed frame
- **Dark mode** support with a demo toggle

## Demo

Run the local demo to experiment with the component:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
