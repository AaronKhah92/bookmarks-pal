import { load } from "cheerio";
const form = document.getElementById("bookmark-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookmarksFile = document.getElementById("bookmarks-file").files[0];
  const searchTerm = document.getElementById("search-term").value;

  // Read contents of bookmarks file
  const fileReader = new FileReader();
  fileReader.readAsText(bookmarksFile);
  const bookmarksHTML = await new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });

  // Parse bookmarks HTML
  const $ = load(bookmarksHTML);
  const bookmarks = [];
  $("a").each((i, element) => {
    const url = $(element).attr("href");
    const title = $(element).text();
    bookmarks.push({ url, title });
  });

  // Filter bookmarks by search term
  const filteredBookmarks = bookmarks.filter(({ title }) =>
    title.includes(searchTerm)
  );

  const response = await fetch(
    `${window.location.origin}/.netlify/functions/index/create-bookmarks-file`,
    {
      method: "POST",
      body: JSON.stringify({ bookmarks: filteredBookmarks }),
      headers: { "Content-Type": "application/json" },
    }
  );

  // Check if the request was successful
  if (response.ok) {
    // Get the HTML text from the response
    const html = await response.text();

    // Create a hidden link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    link.download = "bookmarks.html";

    // Append the link to the document and click it
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  } else {
    console.error("Error creating bookmarks file");
  }
});
