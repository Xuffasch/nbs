self.addEventListener(
  "message", 
  async event => {
    const urls = event.data;
    const images = await Promise.all(
      urls.map( async url => {
        try {
          const response = await fetch(url);
          const fileBlob = await response.blob();
          return URL.createObjectURL(fileBlob);
        } catch (e) {
          return null;
        }
      })
    )
    self.postMessage(images)
  }, 
  false
);