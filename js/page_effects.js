// Wait until the entire webpage is loaded before running the script.
document.addEventListener('DOMContentLoaded', function() {

  // Find the image on the page using the ID we gave it.
  const image = document.getElementById('rotating-pie-chart');

  // Make sure the image was actually found to prevent errors.
  if (image) {

    // This function runs when the cursor moves onto the image.
    image.addEventListener('mouseenter', function() {
      // Add the 'rotate' class to trigger the CSS animation.
      image.classList.add('rotate');
    });

    // This function runs when the CSS animation has completely finished.
    image.addEventListener('transitionend', function() {
      // Remove the 'rotate' class. This resets the image's rotation
      // back to 0 degrees instantly (without animating back)
      // so it's ready for the next hover.
      image.classList.remove('rotate');
    });
  }
});