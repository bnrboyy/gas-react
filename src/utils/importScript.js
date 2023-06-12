import { useEffect } from 'react';

const importScript = resourceUrl => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = resourceUrl;
    script.async = true; 
    document.querySelector('.ckeditor-component').appendChild(script);
    return () => {
        document.querySelector('.ckeditor-component').removeChild(script);
    }
  }, [resourceUrl]);
};
export default importScript;