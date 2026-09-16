const fs = require("fs");
let page = fs.readFileSync("app/dashboard/page.tsx", "utf8");
page = page.replace(
  `} else if (role === "arc") {
    redirect("/dashboard/arc");
  } else if (role === "peneliti") {
    redirect("/dashboard/peneliti");`,
  `} else if (role === "arc" || role === "peneliti") {
    redirect("/dashboard/arc");`
);
fs.writeFileSync("app/dashboard/page.tsx", page, "utf8");
console.log("Redirect both arc and peneliti to /dashboard/arc");
