// Inital way of adding required attribute to inputs rendered using render_form
// Ideally this would be in the serializer

const inputs = document.getElementsByTagName('input');
const labels = document.getElementsByTagName('label');

for (const input of inputs) {
  if (input.type === 'submit') {
    continue;
  } else if (input.type === 'password') {
    input.minLength = 8; // not working
    input.maxLength = 16;
  }
  input.required = true;
}

for (const label of labels) {
  label.innerHTML += " <span class='required-span'>*</span>";
}
