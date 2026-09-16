const fs = require('fs');
let content = fs.readFileSync('app/dashboard/community/page.tsx', 'utf8');

const regex = /const tempId = Date\.now\(\)\.toString\(\);\s*const optimisticMsg: Message = \{\s*id: tempId,\s*sender: user\?\.name \|\| "Saya",\s*role: roleKey,\s*content: msgContent,\s*time: new Date\(\)\.toLocaleTimeString\("id-ID", \{ hour: "2-digit", minute: "2-digit" \}\),\s*isMe: true\s*\};\s*setMessages\(prev => \[\.\.\.prev, optimisticMsg\]\);\s*const \{ error \} = await supabase\.from\("community_messages"\)\.insert\(\[\{\s*community_id: activeChatId,\s*sender_name: user\?\.name \|\| "Saya",\s*sender_role: roleKey,\s*content: msgContent,\s*likes: 0\s*\}\]\);/;

const newLogic = `const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
      sender: user?.name || "Saya",
      role: roleKey,
      content: msgContent,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      isMe: true
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const { error } = await supabase.from("community_messages").insert([{
      id: tempId,
      community_id: activeChatId,
      sender_name: user?.name || "Saya",
      sender_role: roleKey,
      content: msgContent,
      likes: 0
    }]);`;

if (regex.test(content)) {
    content = content.replace(regex, newLogic);
    fs.writeFileSync('app/dashboard/community/page.tsx', content, 'utf8');
    console.log("Replaced!");
} else {
    console.log("Not found!");
}
