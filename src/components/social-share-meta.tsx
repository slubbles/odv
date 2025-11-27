import Head from "next/head"

interface SocialShareMetaProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: "website" | "article"
}

export function SocialShareMeta({
  title,
  description,
  image = "/og-image.jpg",
  url,
  type = "website",
}: SocialShareMetaProps) {
  const fullTitle = `${title} | OneDollarVentures`
  const fullUrl = url || "https://onedollarventures.com"

  return (
    <Head>
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="OneDollarVentures" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
    </Head>
  )
}
