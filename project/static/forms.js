// Inital way of adding required attribute to inputs rendered using render_form
const inputs = document.getElementsByTagName('input');
const password = document.querySelector('input[type=password]');
const togglePassword = document.getElementById('showPassword');
const submitBtn = document.getElementById('submitBtn');

// Make user related inputs required
for (const input of inputs) {
  if (input.type === 'submit' || input.type === 'checkbox') {
    continue;
  }
  input.required = true;
}

// Toggle whether user can see entered password
togglePassword.addEventListener('input', function (e) {
  password.type = password.type === 'password' ? 'text' : 'password';
});

// Ensure that password field has correct type before submitting form
submitBtn.addEventListener('click', function (e) {
  password.type = 'password';
});
