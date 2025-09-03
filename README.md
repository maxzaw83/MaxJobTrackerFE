# Modern Responsive Portfolio Template

A sleek and responsive developer portfolio built with React and Tailwind CSS, featuring smooth animations, elegant effects, and a clean modern design to showcase your skills and projects professionally.

![Portfolio Screenshot](https://raw.githubusercontent.com/maxzaw83/maxzaw/refs/heads/main/public/images/MaxZawePortfolioHomePage.jpg)

## 🛠️ Features

- 📱 Fully responsive design (mobile-first)
- 🌙 Light/dark theme toggle (optional)
- 💼 Static content: About, Education, Award, etc.
- ⚡ Optimized build with fast load times
- 🚀 Azure-hosted with custom domain support

## 🚀 Demo

👉 [Live Demo](https://maxzaw.netlify.app/)

## 🛠 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm / yarn / bun

### Installation

```bash
git clone https://github.com/yourusername/maxportfolio.git
cd max-portfolio

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Start development server
npm run dev
# or
yarn dev
# or
bun dev
```

Visit `http://localhost:4321` in your browser to see it in action.

## 🧩 Customizing the Portfolio

All your content lives inside `src/data/data.ts`. Update the following to make it yours:

### 1. Personal Info

```ts
export const personalInfo = {
  name: "Your Name",
  title: "Your Title",
  location: "Your Location",
  email: "your.email@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://www.linkedin.com/in/yourusername/",
  profileImage: "../src/assets/Profile.jpeg", // Using a relative path as in your example
  profileImageFallback: "https://placehold.co/300x300/1e293b/a78bfa?text=MZ",
  summary: " Your Summary ",
};
```

### 2. Work Experience

```ts
export const experienceData = [
  {
    role: "Your role"
    company: "Company Name",
    location: "Location",
    date: "Start Date - End Date",
    achievements: ["Achievement 1", "Achievement 2"],
  },
];
```

### 3. Education

```ts
export const education = [
  {
    institution: "University Name",
    location: "Location",
    degree: "Your Degree",
    period: "Start Date - End Date",
    achievements: ["Achievement 1", "Achievement 2"],
  },
];
```

### 4. Skills

```ts
export const skillsData = {
  name: ["TypeScript", "Python"],
  icon: ["kig.png"],
  skills: ["Your skill1", "Your Skill2",
  // and more...
};
```

### 5. Projects

```ts
export const projectData = [
  {
    title: "Project Name",
    points: ["Project Description Line1", "Line2"],
    repoUrl: "#Git URL",
  },
];
```

### 6. Awards

```ts
export const awardsData = [
  {
    name: "Award Name",
    issuer: "Issuer",
    date: "Date",
    type: "Type",
    position: "Position",

    title: " Award Name",
    organizer: "Organizer",
    date: "Date",
    prize: "Type",
    scope: "Award Scope",
    description: "Award Description",
  },
];
```

## 📦 Build for Production

```bash
npm run build
# or
yarn build
# or
bun run build
```

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## 📤 Deployment

Easily deploy to platforms like **Vercel**, **Netlify**, **GitHub Pages**, or any static host of your choice.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ©️ Copyright

© 2025 **Max Zaw.** All rights reserved.

Feel free to use this portfolio template to build your own personal site. Simply update the data.ts file with your own details and customize the design to match your style. If you do use this template, a link back or credit to the original author is appreciated. ---

## ⭐ Like it?

If this project has been helpful or inspiring, a star on the repo is always appreciated — it helps increase visibility and encourages future contributions.

---

## 🙏 ❤️ Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
