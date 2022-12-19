import express from "express";
import bodyParser from "body-parser";
const { json } = bodyParser;
import cors from "cors";

const app = express();

app.use(
  json(),
  cors({
    origin: "*",
  })
);

app.post("/create-bookmarks-file", async (req, res) => {
  const bookmarks = req.body.bookmarks;
  let bookmarksHTML = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`;

  bookmarks.forEach(({ url, title }) => {
    bookmarksHTML += `<DT><A HREF="${url}" ADD_DATE="">${title}</A>\n`;
  });

  bookmarksHTML += "</DL><p>";
  const file = new Blob([bookmarksHTML], { type: "text/html" });
  const text = await file.text();
  res.send(text);
});

app.listen(3399, () => console.log("Server listening on port 3399"));
