export default async function handler(req, res) {
  const source =
    "https://raw.githubusercontent.com/yanivmizrachiy/razpages/share/first-quadrant-15/projects/coordinate-first-quadrant-workbook/downloads/coordinate-first-quadrant-selected-15.pdf";

  const upstream = await fetch(source);
  if (!upstream.ok) {
    res.status(502).send("Unable to fetch booklet");
    return;
  }

  const bytes = Buffer.from(await upstream.arrayBuffer());
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="first-quadrant-selected-15.pdf"'
  );
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.status(200).send(bytes);
}
