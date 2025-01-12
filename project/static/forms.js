// Inital way of adding required attribute to inputs rendered using render_form
// Ideally this would be in the serializer

const inputs = document.getElementsByTagName('input');
const labels = document.getElementsByTagName('label');
const togglePassword = document.getElementById('showPassword');
let submitBtn;
let password;

// Make user related inputs required
for (const input of inputs) {
  if (input.type === 'submit') {
    submitBtn = input;
    continue;
  } else if (input.type === 'checkbox') {
    continue;
  } else if (input.type === 'password') {
    password = input;
    input.minLength = 8; // not working
    input.maxLength = 16;
  }
  input.required = true;
}

for (const label of labels) {
  if (label.htmlFor === 'show-password') continue; // Shouldn't have symbol for show label
  label.innerHTML += " <span class='required-span'>*</span>";
}

// Toggle whether user can see entered password
togglePassword.addEventListener('input', function (e) {
  password.type = password.type === 'password' ? 'text' : 'password';
});

// Ensure that password field has correct type before submitting form
submitBtn.addEventListener('click', function (e) {
  password.type = 'password';
});
