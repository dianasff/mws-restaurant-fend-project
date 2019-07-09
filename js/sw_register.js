
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/servicew.js').then(function() {
    console.log("Registration worked!");
  }).catch(function() {
    console.log('Registration failed!');
  });
}