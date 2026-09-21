const fs = require("fs");
let hero = fs.readFileSync("components/shared/HeroSection.tsx", "utf8");
const newImg = `<img
            src="/stories/high_tech_laboratory_photography_at_arc_usk._a_researcher_in_a_white_lab_coat.png"
            alt="ATSIRA Hero"
            className="w-full h-full object-cover"
          />`;
const oldDiv = `<div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXQbTQcjmQUuxxSOW5EwDAsyVHPzLls6Dc4CB9VYsrS0LPJoJrvUqMXZgZ1jVuR6MMOAUdjupA0-Y5OdHJa2k3WJkGoqWX8QFJxXg5p23vUB-YBMyB5tLctQYymwvDu1lIiRDvQIwyerKGb2LWsquuS1T6xh6nG4PPjd2sPN84ud9oBCyF_HMh_feJecPJxHhFDfbKxMIBfa_hIOcrjTgYQpBKeHjYpmj6IcP5qlAEVo9E-KaIigbH9cmKsA4zc8sTCSR9ffBIWBHd')",
          }}
        />`;

hero = hero.replace(newImg, oldDiv);
fs.writeFileSync("components/shared/HeroSection.tsx", hero, "utf8");
console.log("Restored hero image.");
