export const config = {
  // This tells Vercel to ONLY run this script for individual product links
  matcher: '/retailers/:id', 
};

export default async function middleware(request) {
  const url = new URL(request.url);
  
  // 1. Get the product ID from the URL (e.g., 'OSHOOD-001')
  const productId = url.pathname.split('/').pop();

  // 2. Fetch your compiled index.html and your retailers.json file
  const [htmlResponse, dataResponse] = await Promise.all([
    fetch(new URL('/index.html', request.url)),
    fetch(new URL('/assets/retailers.json', request.url))
  ]);

  let html = await htmlResponse.text();
  const products = await dataResponse.json();

  // 3. Find the specific product
  const product = products.find(p => p.id === productId);

  // 4. If the product exists, swap the meta tags!
  if (product && product.images && product.images.length > 0) {
    const title = `${product.name} | Subtlewear B2B`;
    const imageUrl = product.images[0].url;

    // Replace the default tags with the specific product's data
    html = html.replace(
      /<meta property="og:title" content="[^"]*">/i,
      `<meta property="og:title" content="${title}">`
    );
    html = html.replace(
      /<meta property="og:image" content="[^"]*">/i,
      `<meta property="og:image" content="${imageUrl}">`
    );
  }

  // 5. Send the modified HTML to the browser (or WhatsApp bot)
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}