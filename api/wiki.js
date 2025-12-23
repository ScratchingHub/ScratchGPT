import fetch from "node-fetch";
import cheerio from "cheerio";

export default async function handler(req, res){
  try {
    const topic = req.query.q;
    if(!topic) return res.status(400).json({error:"No topic"});

    const url = `https://en.scratch-wiki.info/wiki/${encodeURIComponent(topic)}`;
    const html = await fetch(url).then(r=>r.text());

    const $ = cheerio.load(html);
    let text = "";
    $("#mw-content-text p").each((i, el) => { text += $(el).text() + " "; });

    text = text.replace(/\[\d+\]/g,"").replace(/\s+/g," ").slice(0,2500);

    res.status(200).json({ text });
  } catch(e){
    res.status(500).json({ error:"Failed to fetch wiki" });
  }
}
