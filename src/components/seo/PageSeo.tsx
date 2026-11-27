import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.umyinfra.in';

interface PageSeoProps {
  title: string;
  description: string;
  path: string;
}

const PageSeo = ({ title, description, path }: PageSeoProps) => {
  const canonicalUrl = new URL(path, SITE_URL).toString();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default PageSeo;
