import puppeteer from "puppeteer";

export async function GET() {
  const browser = await puppeteer.launch({
    headless: "new", // or true
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 👉 Load your Next.js page (could be a summary page with props, etc.)
  await page.goto("http://localhost:3000/quiz/68a9f2036764d5fbadd6d59c", {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true, // ✅ Ensures Tailwind colors & gradients render
  });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=quiz-summary.pdf",
    },
  });
}
