self.addEventListener("message", function(event) {
  console.log("message received in ImageWorker.js", event.data)
})