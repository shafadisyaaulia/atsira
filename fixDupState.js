const fs = require("fs");
let content = fs.readFileSync("app/checkout/page.tsx", "utf8");

// Remove the duplicate state lines (second occurrence)
content = content.replace(
  `  const [payStep, setPayStep] = useState("form"); // form | va_code | verifying\n  const [vaCode, setVaCode] = useState("");\n  const [payStep, setPayStep] = useState("form"); // "form" | "va_code" | "verifying" | "success"\n  const [vaCode, setVaCode] = useState("");`,
  `  const [payStep, setPayStep] = useState("form"); // form | va_code | verifying\n  const [vaCode, setVaCode] = useState("");`
);

fs.writeFileSync("app/checkout/page.tsx", content, "utf8");
console.log("DONE");
