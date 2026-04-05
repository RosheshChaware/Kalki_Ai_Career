import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ScholarshipsPage from './src/components/ScholarshipsPage.jsx';

try {
  const html = ReactDOMServer.renderToString(<ScholarshipsPage onClose={() => {}} />);
  console.log("SUCCESS");
} catch (e) {
  console.error("ERROR rendering:", e);
}
