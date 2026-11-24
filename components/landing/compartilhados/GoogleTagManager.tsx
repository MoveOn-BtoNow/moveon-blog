const ID_GTM = "GTM-MWVWRZ86";

const SCRIPT_GTM = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=1;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${ID_GTM}');`;

/** Google Tag Manager das landing pages (mesmo contêiner usado no HTML original). */
export default function GoogleTagManager() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_GTM }} />
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${ID_GTM}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
