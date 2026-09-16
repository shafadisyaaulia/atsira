const fs = require('fs');
let content = fs.readFileSync('app/dashboard/pemasta/page.tsx', 'utf8');

// Remove "use client" and all the prepended imports we added
content = content.replace(/^import Link from "next\/link";\n/, '');
content = content.replace(/^import \{ useAuthStore \} from "@\/lib\/store";\n/, '');
content = content.replace(/^import \{ useRouter \} from "next\/navigation";\n/, '');
content = content.replace(/^import \{ getLang, subscribeLang, toggleLang \} from "@\/lib\/language";\n/, '');
content = content.replace(/^import \{ Globe, Users \} from "lucide-react";\n/, '');
content = content.replace(/^"use client";\r?\n\r?\n/, '');

// Now prepend everything in correct order
const top = `"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { getLang, subscribeLang, toggleLang } from "@/lib/language";
import { 
  Droplet, MapPin, Calendar, Activity, TrendingUp, 
  BookOpen, FileText, Plus, Globe, Users,
  Upload, LayoutDashboard, PenSquare, LogOut, Sparkles,
  Scale, Layers, Sprout, Coins
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RegionCascade } from "@/components/ui/RegionCascade";
`;

// Remove the duplicate import blocks that are now in the content
content = content.replace(/import \{ useState, useEffect \} from "react";\r?\n/, '');
content = content.replace(/import \{ \r?\n  Droplet, MapPin, Calendar, Activity, TrendingUp, \r?\n  BookOpen, FileText, Plus, \r?\n  Upload, LayoutDashboard, PenSquare, LogOut, Sparkles,\r?\n  Scale, Layers, Sprout, Coins\r?\n\} from "lucide-react";\r?\n/, '');
content = content.replace(/import \{ Card \} from "@\/components\/ui\/Card";\r?\n/, '');
content = content.replace(/import \{ Button \} from "@\/components\/ui\/Button";\r?\n/, '');
content = content.replace(/import \{ Input \} from "@\/components\/ui\/Input";\r?\n/, '');
content = content.replace(/import \{ RegionCascade \} from "@\/components\/ui\/RegionCascade";\r?\n/, '');

content = top + '\n' + content;

fs.writeFileSync('app/dashboard/pemasta/page.tsx', content, 'utf8');
console.log('Fixed use client placement');
