const fs = require("fs");
let page = fs.readFileSync("app/dashboard/page.tsx", "utf8");
page = page.replace(
  `} else if (role === "arc" || role === "peneliti") {`,
  `} else if (role === "arc") {
    redirect("/dashboard/arc");
  } else if (role === "peneliti") {`
);
fs.writeFileSync("app/dashboard/page.tsx", page, "utf8");
console.log("Fixed ARC redirect");
