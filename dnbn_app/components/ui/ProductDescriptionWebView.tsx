import { useState } from "react";
import WebView from "react-native-webview";

interface ProductDescriptionWebViewProps {
  html: string;
}

const INJECTED_JS = `(function(){
  function h(){window.ReactNativeWebView.postMessage(JSON.stringify({height:document.body.scrollHeight}));}
  h();
  setTimeout(h,500);
  setTimeout(h,1500);
  var imgs=document.querySelectorAll('img');
  var loaded=0;
  imgs.forEach(function(img){
    if(img.complete){loaded++;if(loaded===imgs.length)h();}
    else{img.addEventListener('load',function(){loaded++;if(loaded===imgs.length)h();});}
  });
})();true;`;

export function ProductDescriptionWebView({ html }: ProductDescriptionWebViewProps) {
  const [height, setHeight] = useState(200);

  const source = {
    html: `<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0'><style>body{margin:0;padding:8px;font-family:-apple-system,sans-serif;font-size:14px;color:#333;word-break:break-word;}img{max-width:100%;height:auto;display:block;}</style></head><body>${html}</body></html>`,
  };

  return (
    <WebView
      source={source}
      style={{ height }}
      scrollEnabled={false}
      injectedJavaScript={INJECTED_JS}
      onMessage={(e) => {
        try {
          const d = JSON.parse(e.nativeEvent.data);
          if (d.height) setHeight((prev) => Math.max(prev, d.height + 16));
        } catch {}
      }}
    />
  );
}
