self.addEventListener("message", async function(event) {
  const imageURL = event.data

  const response = await fetch(imageURL)

  const fileBlob = await response.blob()

  self.postMessage({
    imageURL: imageURL,
    blob: fileBlob,
  })
})
